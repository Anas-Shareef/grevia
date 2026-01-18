<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $orders = $user->orders()
            ->with(['orderItems.product'])
            ->latest()
            ->get();

        // Get all orders in database for comparison
        $allOrders = \App\Models\Order::select('id', 'user_id', 'name')->get();

        return response()->json($orders);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();
        
        // Try to decrypt ID if it's not numeric
        try {
            if (!is_numeric($id)) {
                $decryptedId = decrypt($id);
                // Verify the decrypted ID belongs to the user or if basic ID match
                $id = $decryptedId;
            }
        } catch (\Exception $e) {
            // If decryption fails, continue with original ID (might be numeric)
        }

        // Find order belonging to the user
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['orderItems.product', 'transactions', 'payments'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'shipping_address' => 'required|array',
            'amount' => 'required|numeric',
            'payment_method' => 'required|in:cod,razorpay',
        ]);

        $user = $request->user();
        
        // Calculate total on server side (mock logic for speed)
        $finalAmount = $request->amount; 
        
        // Create Local Order
        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'subtotal' => $finalAmount,
            'shipping' => 0,
            'discount' => 0,
            'total' => $finalAmount,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending', // Pending for COD
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'phone' => $request->phone ?? '',
            'shipping_address' => $request->shipping_address,
            'billing_address' => $request->billing_address ?? $request->shipping_address,
        ]);

        // Create Order Items
        foreach ($request->items as $item) {
             // Find product by slug or ID
             $product = \App\Models\Product::where('slug', $item['product_id'])
             ->orWhere('id', $item['product_id'])
             ->first();
         
             if ($product) {
                 $order->orderItems()->create([
                     'product_id' => $product->id,
                     'product_name' => $product->name,
                     'price' => $product->price,
                     'quantity' => $item['quantity'],
                     'total' => $product->price * $item['quantity'],
                 ]);
             }
        }

        return response()->json([
            'success' => true,
            'order_id' => $order->id,
            'encrypted_order_id' => encrypt($order->id),
            'customer_order_number' => $order->customer_order_number,
            'message' => 'Order placed successfully'
        ]);
    }
    public function cancel($id, Request $request)
    {
        $user = $request->user();
        $order = Order::where('id', $id)->where('user_id', $user->id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if (!in_array($order->status, ['pending', 'processing'])) {
            return response()->json(['message' => 'Order cannot be cancelled in current status'], 400);
        }

        // Cancel the order
        $order->status = 'cancelled';
        $order->cancelled_at = now(); // Ensure column exists or model handles it
        $order->save();

        // Optional: Restore boolean stock (if applicable)
        foreach ($order->orderItems as $item) {
            if ($item->product) {
                // Optimistically mark as in stock if it was out
                $item->product->update(['in_stock' => true]);
            }
        }

        return response()->json(['message' => 'Order cancelled successfully']);
    }

    public function reorder($id, Request $request)
    {
        $user = $request->user();
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with('orderItems.product')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $itemsAdded = 0;
        $itemsSkipped = 0;

        foreach ($order->orderItems as $item) {
            $product = $item->product;
            
            if (!$product || !$product->in_stock) {
                $itemsSkipped++;
                continue;
            }

            // Restore logic: Update or Create CartItem
            $cartItem = \App\Models\CartItem::where('user_id', $user->id)
                ->where('product_id', $product->id)
                ->first();

            if ($cartItem) {
                $cartItem->quantity += $item->quantity;
                $cartItem->save();
            } else {
                \App\Models\CartItem::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'quantity' => $item->quantity
                ]);
            }
            $itemsAdded++;
        }

        $message = $itemsAdded > 0 
            ? 'Items added to cart successfully.' 
            : 'No items were available to reorder.';

        if ($itemsSkipped > 0) {
            $message .= " ($itemsSkipped items unavailable)";
        }

        return response()->json([
            'success' => true, 
            'message' => $message,
            'items_added' => $itemsAdded
        ]);
    }
}
