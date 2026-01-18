<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ContactPage;
use App\Models\ContactMessage;
use App\Mail\ContactSubmissionAck;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function index()
    {
        $page = ContactPage::where('status', true)->first();
        return response()->json($page);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email:filter|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        $message = new ContactMessage();
        $message->full_name = $data['full_name'];
        $message->email = $data['email'];
        $message->phone = $data['phone'] ?? null;
        $message->subject = $data['subject'];
        $message->message = $data['message'];
        $message->status = 'new';
        $message->save();

        // Send Ack Email
        try {
            Mail::to($message->email)->send(new ContactSubmissionAck($message));
        } catch (\Exception $e) {
            // Log error but don't fail request
        }

        return response()->json(['message' => 'Thank you for contacting us. We will get back to you shortly.'], 201);
    }
}
