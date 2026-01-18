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
        Schema::create('admin_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type')->index(); // order, payment, customer, system
            $table->string('title');
            $table->text('message')->nullable();
            
            // UI Helpers
            $table->string('icon')->default('heroicon-o-information-circle');
            $table->string('icon_color')->default('primary'); // primary, success, warning, danger
            
            // Action
            $table->string('action_url')->nullable();
            
            // Core
            $table->boolean('is_read')->default(false)->index();
            $table->timestamps();
            
            // Compound Index for performance (e.g. fetching latest unread)
            $table->index(['created_at', 'is_read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_notifications');
    }
};
