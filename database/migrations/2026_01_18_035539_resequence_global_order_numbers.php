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
        // 1. First Pass: Update ALL to a temporary unique format based on ID to clear conflicts
        // We use the ID to ensure uniqueness.
        DB::table('orders')->update([
            'order_number' => DB::raw("('TEMP-' || id)") // SQLite/MySQL concatenation style
        ]);
        
        // For standard SQL compatibility safer to loop if dialect varies or just loop update
        // But let's just loop-update to be safe and simple since we are in PHP.
        // Actually, 'update' requires valid SQL. Let's strictly loop to avoid SQL dialect issues.
        $orders = DB::table('orders')->select('id')->get();
        foreach ($orders as $order) {
            DB::table('orders')->where('id', $order->id)->update([
                'order_number' => 'TEMP-' . $order->id . '-' . uniqid()
            ]);
        }

        // 2. Second Pass: Assign the desired sequential numbers
        $orders = DB::table('orders')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        $count = 1;
        foreach ($orders as $order) {
            $newOrderNumber = 'ORD-' . str_pad($count, 5, '0', STR_PAD_LEFT);
            
            DB::table('orders')
                ->where('id', $order->id)
                ->update(['order_number' => $newOrderNumber]);
            
            $count++;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
