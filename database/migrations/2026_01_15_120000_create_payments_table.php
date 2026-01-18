<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            
            $table->string('razorpay_order_id')->nullable()->index();
            $table->string('razorpay_payment_id')->nullable()->unique();
            $table->string('razorpay_signature')->nullable();
            
            $table->integer('amount'); // stored in paise
            $table->string('currency')->default('INR');
            $table->string('status')->default('created'); // created, paid, failed, refunded
            
            $table->timestamp('verified_at')->nullable();
            $table->json('raw_payload')->nullable(); // For audit trail
            
            $table->string('method')->nullable();    // e.g., card, upi, netbanking
            $table->string('email')->nullable();     // Payer email
            $table->string('contact')->nullable();   // Payer phone
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
