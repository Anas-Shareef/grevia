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
        Schema::table('cart_items', function (Blueprint $table) {
            $table->foreignId('variant_id')->nullable()->after('product_id')->constrained('product_variants')->onDelete('cascade');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('variant_id')->nullable()->after('product_id')->constrained('product_variants')->onDelete('set null');
            $table->string('weight', 50)->nullable()->after('variant_id');
            $table->integer('pack_size')->nullable()->after('weight');
            $table->string('product_name')->nullable()->change(); // Already exists but ensuring it can handle changes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropForeign(['variant_id']);
            $table->dropColumn('variant_id');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['variant_id']);
            $table->dropColumn(['variant_id', 'weight', 'pack_size']);
        });
    }
};
