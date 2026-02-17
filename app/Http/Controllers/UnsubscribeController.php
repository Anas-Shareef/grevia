<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UnsubscribeController extends Controller
{
    public function unsubscribe(Request $request)
    {
        $email = $request->query('email');
        $campaignId = $request->query('campaign_id');
        $eventId = $request->query('event_id');

        if (!$email) {
            return view('unsubscribe-error', [
                'message' => 'Invalid unsubscribe link. Email address is missing.'
            ]);
        }

        // Verify the signed URL
        if (!$request->hasValidSignature()) {
            return view('unsubscribe-error', [
                'message' => 'This unsubscribe link has expired or is invalid.'
            ]);
        }

        // Update user marketing consent
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->update([
                'marketing_consent' => false,
                'unsubscribed_at' => now(),
            ]);
        }

        // Update subscriber if exists
        DB::table('subscribers')
            ->where('email', $email)
            ->update([
                'status' => 'unsubscribed',
                'unsubscribed_at' => now(),
                'updated_at' => now(),
            ]);

        return view('unsubscribe-success', [
            'email' => $email,
            'campaignId' => $campaignId,
            'eventId' => $eventId,
        ]);
    }

    public function resubscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');

        // Update user marketing consent
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->update([
                'marketing_consent' => true,
                'unsubscribed_at' => null,
            ]);
        }

        // Update subscriber if exists
        DB::table('subscribers')
            ->where('email', $email)
            ->update([
                'status' => 'subscribed',
                'unsubscribed_at' => null,
                'updated_at' => now(),
            ]);

        return redirect()->back()->with('success', 'You have been re-subscribed to marketing emails.');
    }
}
