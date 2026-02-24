<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('variant_images')) {
            Schema::create('variant_images', function (Blueprint $table) {
                $table->id();
                $table->foreignId('variant_id')->constrained('product_variants')->cascadeOnDelete();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->string('image_path');
                $table->boolean('is_main')->default(false);
                $table->unsignedInteger('sort_order')->default(0);
                $table->softDeletes();
                $table->timestamps();

                $table->index(['variant_id', 'is_main']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('variant_images');
    }
};
