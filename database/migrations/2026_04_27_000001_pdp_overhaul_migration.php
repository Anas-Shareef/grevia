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
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'concentration_options')) {
                $table->text('concentration_options')->nullable(); // Store as JSON array
            }
            if (!Schema::hasColumn('products', 'health_benefits')) {
                $table->text('health_benefits')->nullable(); // Store as JSON array
            }
            if (!Schema::hasColumn('products', 'related_product_ids')) {
                $table->text('related_product_ids')->nullable(); // Store as JSON array
            }
            if (!Schema::hasColumn('products', 'enable_guest_reviews')) {
                $table->boolean('enable_guest_reviews')->default(true);
            }
            if (!Schema::hasColumn('products', 'product_description')) {
                $table->text('product_description')->nullable();
            }
        });

        Schema::table('product_reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('product_reviews', 'image_urls')) {
                $table->text('image_urls')->nullable(); // JSON array
            }
            if (!Schema::hasColumn('product_reviews', 'thumbnail_urls')) {
                $table->text('thumbnail_urls')->nullable(); // JSON array
            }
            if (!Schema::hasColumn('product_reviews', 'video_url')) {
                $table->text('video_url')->nullable();
            }
            if (!Schema::hasColumn('product_reviews', 'video_thumbnail_url')) {
                $table->text('video_thumbnail_url')->nullable();
            }
            if (!Schema::hasColumn('product_reviews', 'media_approved')) {
                $table->boolean('media_approved')->default(false);
            }
            if (!Schema::hasColumn('product_reviews', 'verified_customer')) {
                $table->boolean('verified_customer')->default(false);
            }
            if (!Schema::hasColumn('product_reviews', 'verified_guest')) {
                $table->boolean('verified_guest')->default(false);
            }
            if (!Schema::hasColumn('product_reviews', 'helpful_count')) {
                $table->integer('helpful_count')->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'concentration_options', 
                'health_benefits', 
                'related_product_ids', 
                'enable_guest_reviews',
                'product_description'
            ]);
        });

        Schema::table('product_reviews', function (Blueprint $table) {
            $table->dropColumn([
                'image_urls',
                'thumbnail_urls',
                'video_url',
                'video_thumbnail_url',
                'media_approved',
                'verified_customer',
                'verified_guest',
                'helpful_count'
            ]);
        });
    }
};
