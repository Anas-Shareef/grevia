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
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Handle Newsletter Subscription
        if ($request->boolean('newsletter')) {
            \App\Models\Subscriber::updateOrCreate(
                ['email' => $request->email],
                [
                    'is_subscribed' => true,
                    'source' => 'register',
                    'user_id' => $user->id,
                    'name' => $request->name,
                ]
            );
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function firebase(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        Log::info('Firebase Auth Request Received', [
            'raw_request' => $request->all(),
            'keys' => array_keys($request->all())
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
        
        // Detailed logging for debugging
        Log::info('Firebase Token Lookup Response', ['response' => $data]);

        if (empty($data['users'][0])) {
            return response()->json(['message' => 'User not found in Firebase'], 404);
        }

        $firebaseUser = $data['users'][0];
        $uid = $firebaseUser['localId'];
        
        // Robust email extraction: check Firebase response first, then fallback to request
        $extraction_log = [];
        
        $email = $firebaseUser['email'] ?? null;
        if ($email) $extraction_log[] = "found in firebase_user['email']";

        if (!$email) {
            $email = $request->input('email');
            if ($email) $extraction_log[] = "found in request->input('email')";
        }

        if (!$email) {
            $email = $request->input('firebase_email');
            if ($email) $extraction_log[] = "found in request->input('firebase_email')";
        }
        
        // If email still missing, check providerInfo
        if (!$email && !empty($firebaseUser['providerInfo'])) {
            foreach ($firebaseUser['providerInfo'] as $provider) {
                if (!empty($provider['email'])) {
                    $email = $provider['email'];
                    $extraction_log[] = "found in providerInfo";
                    break;
                }
            }
        }

        $displayName = $firebaseUser['displayName'] ?? $request->input('name', 'User');

        if (!$email) {
            // Last resort: Generate a unique placeholder email for the verified identity
            $email = "user_{$uid}@firebase.grevia.in";
            $extraction_log[] = "generated fallback email";
            
            Log::info('Firebase Login: Generated fallback email for UID: ' . $uid, [
                'uid' => $uid,
                'email' => $email
            ]);
        }

        // Final check just in case, though email should now exist
        if (!$email) {
            Log::warning('Firebase Login: Still missing email for UID: ' . $uid, [
                'firebase_user_keys' => array_keys($firebaseUser),
                'request_keys' => array_keys($request->all()),
                'extraction_log' => $extraction_log
            ]);
            
            return response()->json([
                'message' => 'Email is required from Firebase provider',
                'diagnostics' => [
                    'request_received_keys' => array_keys($request->all()),
                    'firebase_response_keys' => array_keys($firebaseUser),
                    'extraction_attempts' => $extraction_log,
                    'uid' => $uid
                ]
            ], 422);
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
