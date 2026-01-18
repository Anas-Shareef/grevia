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
        Schema::table('product_reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('product_reviews', 'is_guest')) {
                $table->boolean('is_guest')->default(false);
            }
            if (!Schema::hasColumn('product_reviews', 'guest_name')) {
                $table->string('guest_name')->nullable();
            }
            if (!Schema::hasColumn('product_reviews', 'guest_email')) {
                $table->string('guest_email')->nullable();
            }
            // Status already exists as enum, skipping re-definition or modification for now to avoid conflict
            // $table->string('status')->default('pending'); 

            // Make user_id nullable if it's not already (requires doctrine/dbal usually, or raw statement)
            // SQLite has limited support for modifying columns. We try standard change() but catch if fails?
            // For now, we assume user_id needs change.
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            //
        });
    }
};
