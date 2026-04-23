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
        Schema::table('categories', function (Blueprint $table) {
            $table->string('card_image_url', 600)->nullable();
            $table->string('card_description', 100)->nullable();
            $table->string('availability_status', 20)->default('active');
            $table->smallInteger('overlay_density')->default(72);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['card_image_url', 'card_description', 'availability_status', 'overlay_density']);
        });
    }
};
