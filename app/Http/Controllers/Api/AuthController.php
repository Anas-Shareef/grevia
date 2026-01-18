<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function firebase(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $firebaseToken = $request->input('token');
        // Use the API KEY provided by the user
        $apiKey = "AIzaSyDAW_bfNcKUguIlf9It7rkMThfQP5Ic6NE"; 
        
        // Verify the token with Google Identity Toolkit
        $response = Http::post("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={$apiKey}", [
            'idToken' => $firebaseToken,
        ]);

        if ($response->failed()) {
            Log::error('Firebase Token Verification Failed', ['error' => $response->body()]);
            return response()->json(['message' => 'Invalid Firebase Token'], 401);
        }

        $data = $response->json();
        
        if (empty($data['users'][0])) {
            return response()->json(['message' => 'User not found in Firebase'], 404);
        }

        $firebaseUser = $data['users'][0];
        $uid = $firebaseUser['localId'];
        $email = $firebaseUser['email'] ?? null;
        $displayName = $firebaseUser['displayName'] ?? 'User';

        if (!$email) {
            return response()->json(['message' => 'Email is required from Firebase provider'], 422);
        }

        // Find or Create User
        $user = User::where('firebase_uid', $uid)->orWhere('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $displayName,
                'email' => $email,
                'password' => Hash::make(Str::random(16)), // Random password, they use Firebase
                'firebase_uid' => $uid,
            ]);
        } else {
            // Link existing user if not linked
            if ($user->firebase_uid !== $uid) {
                $user->update(['firebase_uid' => $uid]);
            }
        }

        // Handle Newsletter Subscription
        if ($request->boolean('newsletter')) {
            \App\Models\Subscriber::updateOrCreate(
                ['email' => $email],
                [
                    'is_subscribed' => true,
                    'source' => 'register',
                    'user_id' => $user->id,
                    'name' => $displayName,
                ]
            );
        }

        // Create Sanctum Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password does not match'], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request...
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
