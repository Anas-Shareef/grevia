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
        Schema::create('contact_page_cms', function (Blueprint $table) {
            $table->id();
            $table->string('page_title');
            $table->longText('page_description')->nullable();
            $table->string('company_name')->nullable();
            $table->string('support_email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('working_hours')->nullable();
            $table->text('map_embed_url')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_page_cms');
    }
};
