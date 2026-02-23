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
        if (!Schema::hasTable('marketing_events')) {
            Schema::create('marketing_events', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('event_key')->unique();
                $table->text('description')->nullable();
                $table->foreignId('email_template_id')->nullable()->constrained('email_templates')->nullOnDelete();
                $table->integer('delay_minutes')->default(0);
                $table->boolean('status')->default(true);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketing_events');
    }
};
