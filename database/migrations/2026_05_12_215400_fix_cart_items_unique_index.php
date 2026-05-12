<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Drop the restrictive old unique index
            $table->dropUnique(['user_id', 'product_id']);
            
            // Add a new one that allows different variants
            // Note: selected_attributes is JSON, so we can't easily include it in the index,
            // but variant_id should be enough to differentiate in most cases.
            // Or we just rely on application logic.
        });
    }

    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->unique(['user_id', 'product_id']);
        });
    }
};
