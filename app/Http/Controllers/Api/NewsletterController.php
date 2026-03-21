<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Services\MoosendService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'  => 'required|email',
            'source' => 'required|in:popup,footer,register,auto',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid data',
                'errors'  => $validator->errors()
            ], 422);
        }

        $email  = $request->input('email');
        $source = $request->input('source');
        $userId = $request->user('sanctum') ? $request->user('sanctum')->id : null;

        // Check if subscriber exists (including soft deleted)
        $subscriber = Subscriber::withTrashed()->where('email', $email)->first();

        if ($subscriber) {
            // Restore if soft-deleted
            if ($subscriber->trashed()) {
                $subscriber->restore();
            }

            // Already subscribed — return friendly message
            if ($subscriber->is_subscribed) {
                return response()->json([
                    'message' => 'You are already subscribed!',
                    'status'  => 'already_subscribed'
                ], 200);
            }

            // Resubscribe
            $subscriber->update([
                'is_subscribed' => true,
                'source'        => $source,
                'user_id'       => $userId ?? $subscriber->user_id,
            ]);

        } else {
            // Create new subscriber
            $subscriber = Subscriber::create([
                'email'         => $email,
                'source'        => $source,
                'user_id'       => $userId,
                'is_subscribed' => true,
            ]);
        }

        // Sync to Moosend grevia email list
        (new MoosendService())->subscribe(
            email: $email,
            name:  $subscriber->name ?? '',
            tags:  ['newsletter', $source]
        );

        return response()->json([
            'message' => 'Successfully subscribed to the newsletter!',
            'status'  => 'subscribed'
        ], 201);
    }
}
