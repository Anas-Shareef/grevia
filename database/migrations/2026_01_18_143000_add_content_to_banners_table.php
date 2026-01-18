<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->text('description')->nullable()->after('title');
            $table->string('primary_button_text')->nullable()->after('description');
            $table->string('primary_button_link')->nullable()->after('primary_button_text');
            $table->string('secondary_button_text')->nullable()->after('primary_button_link');
            $table->string('secondary_button_link')->nullable()->after('secondary_button_text');
            $table->json('features')->nullable()->after('secondary_button_link');
        });
    }

    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn([
                'description',
                'primary_button_text',
                'primary_button_link',
                'secondary_button_text',
                'secondary_button_link',
                'features'
            ]);
        });
    }
};
