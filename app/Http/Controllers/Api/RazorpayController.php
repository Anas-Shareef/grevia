<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RazorpayController extends Controller
{
    protected $api;

    public function __construct()
    {
        $this->api = new Api(config('razorpay.key_id'), config('razorpay.key_secret'));
    }

    public function ping()
    {
        return response()->json([
            'status' => 'online',
            'version' => '1.0.1', // My new version
            'config' => [
                'key_id_set' => filled(config('razorpay.key_id')),
                'key_secret_set' => filled(config('razorpay.key_secret')),
            ],
            'timestamp' => now()->toDateTimeString()
        ]);
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'shipping_address' => 'required|array',
            'amount' => 'required|numeric',
        ]);

        try {
            DB::beginTransaction();

            $user = $request->user();
            
            // 1. Calculate amount in paise and ensure it's an integer
            // Floating point amounts can cause Razorpay API to reject the request
            $finalAmount = (float) $request->amount;
            $amountInPaise = (int) round($finalAmount * 100);

            if ($amountInPaise <= 0) {
                throw new \Exception("Invalid order amount: " . $finalAmount);
            }
            
            // 2. Create Local Order Record
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'subtotal' => $finalAmount,
                'shipping' => 0, // Should ideally be passed or calculated
                'discount' => 0,
                'total' => $finalAmount,
                'payment_method' => 'razorpay',
                'payment_status' => 'pending',
                'name' => $request->name ?? $user->name,
                'email' => $request->email ?? $user->email,
                'phone' => $request->phone ?? '',
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address ?? $request->shipping_address,
            ]);

            // 3. Create Order Items & Manage Stock
            // This was missing in previous implementation
            foreach ($request->items as $item) {
                $product = \App\Models\Product::where('slug', $item['product_id'])
                    ->orWhere('id', $item['product_id'])
                    ->first();
            
                if ($product) {
                    $variant = null;
                    $price = $product->price;
                    $weight = null;
                    $packSize = null;

                    if (!empty($item['variant_id'])) {
                        $variant = \App\Models\ProductVariant::find($item['variant_id']);
                        if ($variant && $variant->product_id == $product->id) {
                            $price = $variant->effective_price;
                            $weight = $variant->weight;
                            $packSize = $variant->pack_size;
                            
                            // Deduct stock
                            $variant->decrement('stock_quantity', $item['quantity']);
                        }
                    }

                    $order->orderItems()->create([
                        'product_id' => $product->id,
                        'variant_id' => $variant ? $variant->id : null,
                        'product_name' => $product->name,
                        'weight' => $weight,
                        'pack_size' => $packSize,
                        'price' => $price,
                        'quantity' => $item['quantity'],
                        'total' => $price * $item['quantity'],
                    ]);
                }
            }

            // 4. Create Razorpay Order via API
            $rzpOrder = $this->api->order->create([
                'amount' => $amountInPaise,
                'currency' => 'INR',
                'payment_capture' => 1,
            ]);

            // 5. Create Local Payment Record
            Payment::create([
                'order_id' => $order->id,
                'razorpay_order_id' => $rzpOrder->id,
                'amount' => $amountInPaise,
                'currency' => 'INR',
                'status' => 'created',
            ]);

            // 6. Marketing Sync (Moosend)
            $customerEmail = $order->email;
            $customerName  = $order->name;
            if ($customerEmail && class_exists('\App\Services\MoosendService')) {
                try {
                    (new \App\Services\MoosendService())->subscribe(
                        email: $customerEmail,
                        name:  $customerName,
                        tags:  ['shopper', 'razorpay-initiated']
                    );
                } catch (\Exception $mooEx) {
                    Log::warning('Moosend checkout sync failed: ' . $mooEx->getMessage());
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => [
                    'key_id' => config('razorpay.key_id'),
                    'order_id' => $rzpOrder->id,
                    'local_order_id' => $order->id,
                    'encrypted_order_id' => encrypt($order->id),
                    'customer_order_number' => $order->customer_order_number,
                    'amount' => $amountInPaise,
                    'currency' => 'INR',
                    'name' => "Grevia Foods",
                    'description' => "Order #{$order->order_number}",
                    'prefill' => [
                        'name' => $order->name,
                        'email' => $order->email,
                        'contact' => $order->phone,
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Razorpay Create Order Error: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => $request->user()?->id,
                'payload' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate payment', 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature' => 'required',
        ]);

        $attributes = [
            'razorpay_order_id' => $request->razorpay_order_id,
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'razorpay_signature' => $request->razorpay_signature
        ];

        try {
            // Verify Signature
            $this->api->utility->verifyPaymentSignature($attributes);

            // Transaction Block
            DB::transaction(function () use ($request) {
                // Update Payment Record
                $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)->firstOrFail();
                
                $payment->update([
                    'razorpay_payment_id' => $request->razorpay_payment_id,
                    'razorpay_signature' => $request->razorpay_signature,
                    'status' => 'paid',
                    'verified_at' => now(),
                    'method' => 'razorpay', // Could fetch from API if needed
                ]);

                // Update Order Record
                $order = Order::findOrFail($payment->order_id);
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing',
                    'payment_reference' => $request->razorpay_payment_id,
                    'transaction_id' => $request->razorpay_payment_id
                ]);
            });

            return response()->json(['success' => true, 'message' => 'Payment verified successfully']);

        } catch (\Razorpay\Api\Errors\SignatureVerificationError $e) {
            
            // Log Failure
            $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)->first();
            if ($payment) {
                $payment->update(['status' => 'failed', 'raw_payload' => json_encode($request->all())]);
            }
            
            Log::warning('Razorpay Signature Mismatch: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Payment verification failed'], 400);

        } catch (\Exception $e) {
            Log::error('Razorpay Verify Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Server error during verification'], 500);
        }
    }
}
