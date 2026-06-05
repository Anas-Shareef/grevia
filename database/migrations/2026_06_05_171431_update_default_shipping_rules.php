<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $method = \DB::table('shipping_methods')->first();
        if ($method) {
            \DB::table('shipping_methods')->where('id', $method->id)->update([
                'cost' => 60.00,
                'rule_free_above' => 499.00,
            ]);
        } else {
            \DB::table('shipping_methods')->insert([
                'name' => 'Standard Shipping',
                'cost' => 60.00,
                'rule_free_above' => 499.00,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $method = \DB::table('shipping_methods')->first();
        if ($method) {
            \DB::table('shipping_methods')->where('id', $method->id)->update([
                'cost' => 100.00,
                'rule_free_above' => 500.00,
            ]);
        }
    }
};
