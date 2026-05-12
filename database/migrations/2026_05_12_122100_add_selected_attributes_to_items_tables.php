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
            $table->json('selected_attributes')->nullable()->after('pack_size');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->json('selected_attributes')->nullable()->after('pack_size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropColumn('selected_attributes');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('selected_attributes');
        });
    }
};
