<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_order_number')->nullable()->after('order_number');
        });

        // Backfill logic
        $users = DB::table('users')->pluck('id');

        foreach ($users as $userId) {
            $orders = DB::table('orders')
                ->where('user_id', $userId)
                ->orderBy('created_at')
                ->orderBy('id')
                ->get();

            $count = 1;
            foreach ($orders as $order) {
                // Format: ORD-01, ORD-02 ...
                $customerOrderNumber = 'ORD-' . str_pad($count, 2, '0', STR_PAD_LEFT);
                
                DB::table('orders')
                    ->where('id', $order->id)
                    ->update(['customer_order_number' => $customerOrderNumber]);
                
                $count++;
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('customer_order_number');
        });
    }
};
