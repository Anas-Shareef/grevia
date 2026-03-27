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
        Schema::table('products', function (Blueprint $table) {
            $table->string('ratio')->nullable()->after('subcategory');
            $table->string('form')->nullable()->after('ratio');
            $table->string('type')->nullable()->after('form');
            $table->string('size_label')->nullable()->after('type');
            $table->string('sweetness_description')->nullable()->after('size_label');
            $table->string('use_case')->nullable()->after('sweetness_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['ratio', 'form', 'type', 'size_label', 'sweetness_description', 'use_case']);
        });
    }
};
