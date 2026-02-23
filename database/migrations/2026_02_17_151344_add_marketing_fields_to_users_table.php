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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'marketing_consent')) {
                $table->boolean('marketing_consent')->default(false)->after('email');
            }
            if (!Schema::hasColumn('users', 'unsubscribed_at')) {
                $table->timestamp('unsubscribed_at')->nullable()->after('marketing_consent');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['marketing_consent', 'unsubscribed_at']);
        });
    }
};
