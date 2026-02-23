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
            ->with(['orderItems.product', 'orderItems.variant'])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();
        
        // Try to decrypt ID if it's not numeric
        try {
            if (!is_numeric($id)) {
                $decryptedId = decrypt($id);
                $id = $decryptedId;
            }
        } catch (\Exception $e) {
            // Continue with original ID
        }

        // Find order belonging to the user
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['orderItems.product', 'orderItems.variant', 'transactions', 'payments'])
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
        $finalAmount = $request->amount; 
        
        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'subtotal' => $finalAmount,
            'shipping' => 0,
            'discount' => 0,
            'total' => $finalAmount,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'phone' => $request->phone ?? '',
            'shipping_address' => $request->shipping_address,
            'billing_address' => $request->billing_address ?? $request->shipping_address,
        ]);

        // Create Order Items
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

        $order->status = 'cancelled';
        $order->cancelled_at = now();
        $order->save();

        // Restore stock
        foreach ($order->orderItems as $item) {
            if ($item->variant_id) {
                $variant = \App\Models\ProductVariant::find($item->variant_id);
                if ($variant) {
                    $variant->increment('stock_quantity', $item->quantity);
                }
            } elseif ($item->product) {
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
            ->with(['orderItems.product', 'orderItems.variant'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $itemsAdded = 0;
        $itemsSkipped = 0;

        foreach ($order->orderItems as $item) {
            $product = $item->product;
            $variant = $item->variant;
            
            // Check availability
            $isAvailable = false;
            if ($variant) {
                $isAvailable = $variant->status === 'active' && $variant->stock_quantity >= $item->quantity;
            } elseif ($product) {
                $isAvailable = $product->in_stock;
            }

            if (!$isAvailable) {
                $itemsSkipped++;
                continue;
            }

            // Restore logic: Update or Create CartItem
            \App\Models\CartItem::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'variant_id' => $item->variant_id
                ],
                [
                    'quantity' => \DB::raw('quantity + ' . $item->quantity)
                ]
            );

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
