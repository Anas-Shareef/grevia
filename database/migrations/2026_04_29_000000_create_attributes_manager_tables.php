<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attributes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('label', 100);
            $table->string('display_type')->default('text_label');
            $table->string('filter_type')->default('single_select');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_required')->default(false);
            $table->timestamps();
        });

        Schema::create('attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attribute_id')->constrained('attributes')->cascadeOnDelete();
            $table->string('value_text', 150);
            $table->string('icon_url', 500)->nullable();
            $table->string('slug', 150);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('product_attribute_value', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('value_id')->constrained('attribute_values')->restrictOnDelete();
            $table->primary(['product_id', 'value_id']);
        });

        Schema::create('product_content', function (Blueprint $table) {
            $table->foreignId('product_id')->primary()->constrained('products')->cascadeOnDelete();
            $table->longText('attr_product_story')->nullable();
            $table->longText('attr_usage_prep')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_content');
        Schema::dropIfExists('product_attribute_value');
        Schema::dropIfExists('attribute_values');
        Schema::dropIfExists('attributes');
    }
};
