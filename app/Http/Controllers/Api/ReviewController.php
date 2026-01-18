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

        $rules = [
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'comment' => 'required|string',
            'images.*' => 'nullable|image|max:2048',
        ];

        if (!$user) {
            $rules['guest_name'] = 'required|string|max:255';
            $rules['guest_email'] = 'required|email|max:255';
        }

        $validated = $request->validate($rules);
        $productId = $validated['product_id'];

        if ($user) {
             // 1. Check if already reviewed
            if ($user->reviews()->where('product_id', $productId)->exists()) {
                return response()->json(['message' => 'You have already reviewed this product.'], 422);
            }

            // 2. Verified Purchase Check (Relaxed: completed OR processing)
            $hasPurchased = $user->orders()
                ->whereIn('status', ['completed', 'processing'])
                ->whereHas('orderItems', function ($q) use ($productId) {
                    $q->where('product_id', $productId);
                })->exists();

            if (!$hasPurchased) {
                return response()->json(['message' => 'You can only review products you have purchased.'], 403);
            }
        } else {
            // Guest Logic: Check if email already reviewed this product
            $existingReview = ProductReview::where('product_id', $productId)
                ->where('guest_email', $validated['guest_email'])
                ->exists();
            
            if ($existingReview) {
                return response()->json(['message' => 'You have already reviewed this product with this email.'], 422);
            }
        }

        DB::beginTransaction();
        try {
            $reviewData = [
                'product_id' => $productId,
                'rating' => $validated['rating'],
                'title' => $validated['title'],
                'comment' => $validated['comment'],
                'status' => 'pending',
                'is_verified_purchase' => $user ? true : false,
            ];

            if ($user) {
                $review = $user->reviews()->create($reviewData);
            } else {
                $reviewData['guest_name'] = $validated['guest_name'];
                $reviewData['guest_email'] = $validated['guest_email'];
                $review = ProductReview::create($reviewData);
            }

            // Handle Images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('reviews', 'public');
                    $review->images()->create(['image_path' => $path]);
                }
            }

            DB::commit();

            // Send Email to Guest
            if (!$user) {
                try {
                    \Illuminate\Support\Facades\Mail::to($review->guest_email)->send(new \App\Mail\GuestReviewSubmitted($review));
                } catch (\Exception $e) {
                    // Log email failure but don't fail request
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
