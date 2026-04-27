<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * List all reviews for a product (Public)
     */
    public function index(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $reviews = ProductReview::with(['user:id,name', 'images'])
            ->where('product_id', $request->product_id)
            ->approved()
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * List authenticated user's reviews (Private)
     */
    public function userReviews(Request $request)
    {
        $reviews = $request->user()->reviews()
            ->with(['product' => function ($query) {
                $query->select('id', 'name', 'slug', 'image')->with(['mainImage', 'gallery']);
            }])
            ->latest()
            ->get();

        // Append image_url to each product 
        $reviews->each(function($review) {
            if($review->product) {
                $review->product->append('image_url');
            }
        });

        return response()->json($reviews);
    }

    /**
     * Submit a review (Private, Verified Check)
     */
    public function store(Request $request)
    {
        $user = $request->user('sanctum'); // Handle optional auth
        $product = \App\Models\Product::findOrFail($request->product_id);

        $rules = [
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'comment' => 'required|string',
            'media.*' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,avi|max:20480', // 20MB limit for video
        ];

        if (!$user) {
            // Check if guest reviews are enabled for this product
            if (!$product->enable_guest_reviews) {
                return response()->json(['message' => 'Only verified customers who purchased this product can leave reviews.'], 403);
            }
            $rules['guest_name'] = 'required|string|max:255';
            $rules['guest_email'] = 'required|email|max:255';
        }

        $validated = $request->validate($rules);
        $productId = $validated['product_id'];

        $isVerifiedPurchase = false;
        $verifiedCustomer = false;
        $verifiedGuest = false;

        if ($user) {
            if ($user->reviews()->where('product_id', $productId)->exists()) {
                return response()->json(['message' => 'You have already reviewed this product.'], 422);
            }

            $hasPurchased = $user->orders()
                ->whereIn('status', ['completed', 'processing'])
                ->whereHas('orderItems', function ($q) use ($productId) {
                    $q->where('product_id', $productId);
                })->exists();

            $isVerifiedPurchase = $hasPurchased;
            $verifiedCustomer = $hasPurchased;
        } else {
            $existingReview = ProductReview::where('product_id', $productId)
                ->where('guest_email', $validated['guest_email'])
                ->exists();
            
            if ($existingReview) {
                return response()->json(['message' => 'You have already reviewed this product with this email.'], 422);
            }

            $hasPurchased = \App\Models\Order::where('email', $validated['guest_email'])
                ->whereIn('status', ['completed', 'processing'])
                ->whereHas('orderItems', function ($q) use ($productId) {
                    $q->where('product_id', $productId);
                })->exists();
            
            $isVerifiedPurchase = $hasPurchased;
            $verifiedGuest = $hasPurchased;
        }

        DB::beginTransaction();
        try {
            $reviewData = [
                'product_id' => $productId,
                'rating' => $validated['rating'],
                'title' => $validated['title'],
                'comment' => $validated['comment'],
                'status' => 'pending',
                'is_verified_purchase' => $isVerifiedPurchase,
                'verified_customer' => $verifiedCustomer,
                'verified_guest' => $verifiedGuest,
                'helpful_count' => 0,
            ];

            if ($user) {
                $review = $user->reviews()->create($reviewData);
            } else {
                $reviewData['guest_name'] = $validated['guest_name'];
                $reviewData['guest_email'] = $validated['guest_email'];
                $review = ProductReview::create($reviewData);
            }

            // Handle Media
            $imageUrls = [];
            $videoUrl = null;

            if ($request->hasFile('media')) {
                foreach ($request->file('media') as $file) {
                    $mime = $file->getMimeType();
                    if (str_starts_with($mime, 'video/')) {
                        $videoUrl = $file->store('reviews/videos', 'public');
                        // Generate thumbnail placeholder or logic if needed
                    } else {
                        $path = $file->store('reviews/images', 'public');
                        $imageUrls[] = \Illuminate\Support\Facades\Storage::url($path);
                        // Also store in legacy relationship for backward compat
                        $review->images()->create(['image_path' => $path]);
                    }
                }
            }

            $review->update([
                'image_urls' => $imageUrls,
                'video_url' => $videoUrl ? \Illuminate\Support\Facades\Storage::url($videoUrl) : null,
            ]);

            DB::commit();

            if (!$user) {
                try {
                    \Illuminate\Support\Facades\Mail::to($review->guest_email)->send(new \App\Mail\GuestReviewSubmitted($review));
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Review Email Failed: ' . $e->getMessage());
                }
            }

            return response()->json([
                'message' => 'Review submitted successfully and is awaiting approval.',
                'review' => $review,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to submit review: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Mark review as helpful
     */
    public function helpful(string $id)
    {
        $review = ProductReview::findOrFail($id);
        $review->increment('helpful_count');
        return response()->json(['message' => 'Feedback recorded!', 'helpful_count' => $review->helpful_count]);
    }

    /**
     * Update user's own review (Only if pending)
     */
    public function update(Request $request, string $id)
    {
        $review = $request->user()->reviews()->findOrFail($id);

        if ($review->status !== 'pending') {
            return response()->json(['message' => 'Approved or rejected reviews cannot be edited.'], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'comment' => 'required|string',
        ]);

        $review->update($validated);

        return response()->json([
            'message' => 'Review updated successfully.',
            'review' => $review
        ]);
    }

    /**
     * Delete user's own review
     */
    public function destroy(Request $request, string $id)
    {
        $review = $request->user()->reviews()->findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}
