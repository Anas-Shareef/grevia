<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Apply / validate a coupon code.
     *
     * POST /api/coupon/apply
     * Body: { code: string, subtotal: number }
     */
    public function apply(Request $request)
    {
        $request->validate([
            'code'     => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $code     = strtoupper(trim($request->code));
        $subtotal = (float) $request->subtotal;

        // 1. Find coupon (case-insensitive)
        $coupon = Coupon::whereRaw('UPPER(code) = ?', [$code])->first();

        if (!$coupon) {
            return response()->json([
                'valid'   => false,
                'message' => 'Invalid coupon code.',
            ], 422);
        }

        // 2. Check active status
        if (!$coupon->status) {
            return response()->json([
                'valid'   => false,
                'message' => 'This coupon is inactive.',
            ], 422);
        }

        // 3. Check expiry
        if ($coupon->expiry_date && now()->isAfter($coupon->expiry_date)) {
            return response()->json([
                'valid'   => false,
                'message' => 'This coupon has expired.',
            ], 422);
        }

        // 4. Check usage limit
        if ($coupon->usage_limit !== null && $coupon->usage_count >= $coupon->usage_limit) {
            return response()->json([
                'valid'   => false,
                'message' => 'This coupon has reached its usage limit.',
            ], 422);
        }

        // 5. Check minimum order value
        if ($subtotal < (float) $coupon->min_order_value) {
            return response()->json([
                'valid'   => false,
                'message' => 'Minimum order value of ₹' . number_format($coupon->min_order_value, 0) . ' required for this coupon.',
            ], 422);
        }

        // 6. Calculate discount
        $discountAmount = 0;
        if ($coupon->type === 'percentage') {
            $discountAmount = round(($subtotal * (float) $coupon->value) / 100, 2);
        } else {
            // fixed
            $discountAmount = min((float) $coupon->value, $subtotal);
        }

        return response()->json([
            'valid'           => true,
            'code'            => $coupon->code,
            'type'            => $coupon->type,
            'value'           => $coupon->value,
            'discount_amount' => $discountAmount,
            'message'         => $coupon->type === 'percentage'
                ? "{$coupon->value}% off applied! You save ₹" . number_format($discountAmount, 0) . '.'
                : "₹" . number_format($discountAmount, 0) . " discount applied!",
        ]);
    }
}
