<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ShippingMethod;

class ShippingMethodSeeder extends Seeder
{
    public function run(): void
    {
        ShippingMethod::create([
            'name' => 'Standard Shipping',
            'cost' => 100.00,
            'rule_free_above' => 500.00,
            'is_active' => true,
        ]);
    }
}
