<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Get user's cart
    public function index(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['items' => []], 401);
        }

        $cartItems = CartItem::where('user_id', $user->id)
            ->with('product')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product->slug ?? $item->product->id, // Use slug to match frontend
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                    'image' => $item->product->image_url,
                    'quantity' => $item->quantity,
                ];
            });

        return response()->json(['items' => $cartItems]);
    }

    // Sync entire cart from frontend
    public function sync(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $items = $request->input('items', []);

        // Flatten duplicates if any (summing quantities or taking last)
        // Since frontend should handle specific item logic, we'll just unique by ID to prevent crashes
        // but robustly, we should map them to actual product IDs first.
        
        // Clear existing cart
        CartItem::where('user_id', $user->id)->delete();
        
        // Track added product IDs to prevent SQL unique constraint errors within this transaction
        $addedProductIds = [];

        foreach ($items as $item) {
            // Find product by slug or ID
            $product = \App\Models\Product::where('slug', $item['id'])
                ->orWhere('id', $item['id'])
                ->first();
            
            if (!$product) {
                \Log::warning('Product not found for cart sync', ['product_id' => $item['id']]);
                continue;
            }

            // Skip if we already added this product in this sync cycle
            if (in_array($product->id, $addedProductIds)) {
                continue;
            }

            CartItem::create([
                'user_id' => $user->id,
                'product_id' => $product->id, // Use numeric ID
                'quantity' => $item['quantity'],
            ]);
            
            $addedProductIds[] = $product->id;
        }

        return response()->json(['success' => true]);
    }

    // Add or update single item
    public function addItem(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'product_id' => 'required',
            'quantity' => 'required|integer|min:1',
        ]);

        // Find product by slug or ID
        $product = \App\Models\Product::where('slug', $validated['product_id'])
            ->orWhere('id', $validated['product_id'])
            ->first();
        
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        CartItem::updateOrCreate(
            [
                'user_id' => $user->id,
                'product_id' => $product->id, // Use numeric ID
            ],
            [
                'quantity' => $validated['quantity'],
            ]
        );

        return response()->json(['success' => true]);
    }

    // Remove item from cart
    public function removeItem(Request $request, $productId)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['success' => true]);
    }

    // Clear entire cart
    public function clear(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        CartItem::where('user_id', $user->id)->delete();

        return response()->json(['success' => true]);
    }
}
