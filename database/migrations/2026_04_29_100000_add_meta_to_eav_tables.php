<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add meta JSON column to attribute_values
        if (Schema::hasTable('attribute_values') && !Schema::hasColumn('attribute_values', 'meta')) {
            Schema::table('attribute_values', function (Blueprint $table) {
                $table->json('meta')->nullable()->after('sort_order');
            });
        }

        // Add is_default_concentration to pivot
        if (Schema::hasTable('product_attribute_value') && !Schema::hasColumn('product_attribute_value', 'is_default_concentration')) {
            Schema::table('product_attribute_value', function (Blueprint $table) {
                $table->tinyInteger('is_default_concentration')->default(0)->after('value_id');
            });
        }

        // Add slug column to attributes table if missing
        if (Schema::hasTable('attributes') && !Schema::hasColumn('attributes', 'slug')) {
            Schema::table('attributes', function (Blueprint $table) {
                $table->string('slug', 100)->nullable()->after('name');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('attribute_values') && Schema::hasColumn('attribute_values', 'meta')) {
            Schema::table('attribute_values', function (Blueprint $table) {
                $table->dropColumn('meta');
            });
        }

        if (Schema::hasTable('product_attribute_value') && Schema::hasColumn('product_attribute_value', 'is_default_concentration')) {
            Schema::table('product_attribute_value', function (Blueprint $table) {
                $table->dropColumn('is_default_concentration');
            });
        }

        if (Schema::hasTable('attributes') && Schema::hasColumn('attributes', 'slug')) {
            Schema::table('attributes', function (Blueprint $table) {
                $table->dropColumn('slug');
            });
        }
    }
};
