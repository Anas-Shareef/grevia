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

        $relations = ['product'];
        $hasVariantsTable = \Schema::hasTable('product_variants');
        if ($hasVariantsTable) {
            $relations[] = 'variant';
        }

        $cartItems = CartItem::where('user_id', $user->id)
            ->with($relations)
            ->get()
            ->map(function ($item) use ($hasVariantsTable) {
                $hasVariant = $hasVariantsTable && $item->variant;
                return [
                    'id' => $item->product->slug ?? $item->product->id,
                    'variant_id' => $item->variant_id,
                    'name' => $item->product->name,
                    'price' => $hasVariant ? $item->variant->effective_price : $item->product->price,
                    'image' => $item->product->image_url,
                    'quantity' => $item->quantity,
                    'weight' => $hasVariant ? $item->variant->weight : null,
                    'pack_size' => $hasVariant ? $item->variant->pack_size : null,
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
        
        // Clear existing cart
        CartItem::where('user_id', $user->id)->delete();
        
        // Track unique combos to prevent duplicate entries
        $addedCombos = [];

        foreach ($items as $item) {
            // Find product by slug or ID
            $product = \App\Models\Product::where('slug', $item['id'])
                ->orWhere('id', $item['id'])
                ->first();
            
            if (!$product) {
                continue;
            }

            $variantId = $item['variant_id'] ?? null;
            $comboKey = $product->id . '_' . ($variantId ?? '0');

            if (in_array($comboKey, $addedCombos)) {
                continue;
            }

            CartItem::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
                'variant_id' => $variantId,
                'quantity' => $item['quantity'],
            ]);
            
            $addedCombos[] = $comboKey;
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

        $rules = [
            'product_id' => 'required',
            'quantity' => 'required|integer|min:1',
        ];

        // Only validate exists if table exists
        if (\Schema::hasTable('product_variants')) {
            $rules['variant_id'] = 'nullable|exists:product_variants,id';
        } else {
            $rules['variant_id'] = 'nullable';
        }

        $validated = $request->validate($rules);

        // Find product by slug or ID
        $product = \App\Models\Product::where('slug', $validated['product_id'])
            ->orWhere('id', $validated['product_id'])
            ->first();
        
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Validate variant belongs to product if provided and table exists
        if ($validated['variant_id'] && \Schema::hasTable('product_variants')) {
            $variant = \App\Models\ProductVariant::where('id', $validated['variant_id'])
                ->where('product_id', $product->id)
                ->first();
            if (!$variant) {
                return response()->json(['error' => 'Invalid variant for this product'], 422);
            }
        }

        CartItem::updateOrCreate(
            [
                'user_id' => $user->id,
                'product_id' => $product->id,
                'variant_id' => $validated['variant_id'],
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

        $variantId = $request->query('variant_id');

        $query = CartItem::where('user_id', $user->id);
        
        if (is_numeric($productId)) {
            $query->where('product_id', $productId);
        } else {
            $query->whereHas('product', function($q) use ($productId) {
                $q->where('slug', $productId);
            });
        }

        if ($variantId) {
            $query->where('variant_id', $variantId);
        }

        $query->delete();

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
