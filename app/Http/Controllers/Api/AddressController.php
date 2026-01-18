<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerAddress;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses()->orderByDesc('created_at')->get();
        
        return response()->json([
            'default_shipping' => $addresses->where('is_default_shipping', true)->first(),
            'default_billing' => $addresses->where('is_default_billing', true)->first(),
            'addresses' => $addresses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'phone' => 'required|numeric|digits_between:10,15',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'required|string|max:100',
            'pincode' => 'required|numeric|digits_between:4,10',
            'is_default_billing' => 'boolean',
            'is_default_shipping' => 'boolean',
        ]);

        $user = $request->user();

        // Handle defaults
        if ($validated['is_default_billing'] ?? false) {
            $user->addresses()->update(['is_default_billing' => false]);
        }
        if ($validated['is_default_shipping'] ?? false) {
            $user->addresses()->update(['is_default_shipping' => false]);
        }

        $address = $user->addresses()->create($validated);

        return response()->json([
            'message' => 'Address created successfully',
            'address' => $address,
            'default_shipping' => $user->addresses()->where('is_default_shipping', true)->first(),
            'default_billing' => $user->addresses()->where('is_default_billing', true)->first(),
            'addresses' => $user->addresses()->orderByDesc('created_at')->get()
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'phone' => 'required|numeric|digits_between:10,15',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'required|string|max:100',
            'pincode' => 'required|numeric|digits_between:4,10',
            'is_default_billing' => 'boolean',
            'is_default_shipping' => 'boolean',
        ]);

        // Handle defaults
        if ($validated['is_default_billing'] ?? false) {
            $request->user()->addresses()->where('id', '!=', $id)->update(['is_default_billing' => false]);
        }
        if ($validated['is_default_shipping'] ?? false) {
            $request->user()->addresses()->where('id', '!=', $id)->update(['is_default_shipping' => false]);
        }

        $address->update($validated);

        return response()->json([
            'message' => 'Address updated successfully',
            'address' => $address,
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        
        $wasDefaultShipping = $address->is_default_shipping;
        $wasDefaultBilling = $address->is_default_billing;
        
        $address->delete();

        // Reassign defaults if needed
        if ($wasDefaultShipping) {
            $newDefault = $request->user()->addresses()->first();
            if ($newDefault) {
                $newDefault->update(['is_default_shipping' => true]);
            }
        }

        if ($wasDefaultBilling) {
            $newDefault = $request->user()->addresses()->where('is_default_shipping', false)->first() ?? $request->user()->addresses()->first();
             if ($newDefault) {
                $newDefault->update(['is_default_billing' => true]);
            }
        }

        return response()->json([
            'message' => 'Address deleted successfully',
            'addresses' => $request->user()->addresses()->orderByDesc('created_at')->get()
        ]);
    }
}
