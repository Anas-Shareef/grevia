<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Show "Enable Variant Photos" only when table is missing
            Action::make('enable_variant_photos')
                ->label('🖼️ Enable Variant Photos')
                ->color('success')
                ->icon('heroicon-o-photo')
                ->visible(fn () => !Schema::hasTable('variant_images'))
                ->requiresConfirmation()
                ->modalHeading('Enable Variant Photos?')
                ->modalDescription('This will set up the database so each variant (250g, 500g, etc.) can have its own photos. Takes 1 second.')
                ->modalSubmitActionLabel('Yes, Enable Now')
                ->action(function () {
                    try {
                        DB::statement('
                            CREATE TABLE IF NOT EXISTS `variant_images` (
                                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                `variant_id` BIGINT UNSIGNED NOT NULL,
                                `product_id` BIGINT UNSIGNED NOT NULL,
                                `image_path` VARCHAR(255) NOT NULL,
                                `is_main` TINYINT(1) NOT NULL DEFAULT 0,
                                `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
                                `deleted_at` TIMESTAMP NULL DEFAULT NULL,
                                `created_at` TIMESTAMP NULL DEFAULT NULL,
                                `updated_at` TIMESTAMP NULL DEFAULT NULL,
                                PRIMARY KEY (`id`),
                                INDEX `vi_variant_is_main` (`variant_id`, `is_main`),
                                CONSTRAINT `vi_variant_id_foreign`
                                    FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE CASCADE,
                                CONSTRAINT `vi_product_id_foreign`
                                    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                        ');

                        // Mark migration as run
                        DB::table('migrations')->insertOrIgnore([
                            'migration' => '2026_02_24_050000_create_variant_images_table',
                            'batch'     => DB::table('migrations')->max('batch') + 1,
                        ]);

                        \Illuminate\Support\Facades\Artisan::call('optimize:clear');

                        Notification::make()
                            ->title('✅ Variant Photos Enabled!')
                            ->body('Reload this page to see the "Add Photo" section inside each variant.')
                            ->success()
                            ->persistent()
                            ->send();

                    } catch (\Exception $e) {
                        Notification::make()
                            ->title('❌ Error')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

        DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        $record = $this->record;
        $data   = $this->data;

        if (!Schema::hasTable('product_attribute_value') || !Schema::hasTable('attribute_values')) {
            return;
        }

        $this->saveEavAttribute($record, 'format',        $data['attr_format'] ?? null,             false);
        $this->saveEavAttribute($record, 'concentration',  $data['attr_concentration'] ?? [],         true);
        $this->saveEavAttribute($record, 'trust_badges',   $data['attr_trust_badges'] ?? [],          true);

        // Set is_default_concentration
        if (!empty($data['attr_default_concentration']) && Schema::hasColumn('product_attribute_value', 'is_default_concentration')) {
            $concAttr = \App\Models\Attribute::where('name', 'concentration')->first();
            if ($concAttr) {
                // Reset all concentrations for this product
                DB::table('product_attribute_value')
                    ->where('product_id', $record->id)
                    ->whereIn('value_id', $concAttr->values->pluck('id'))
                    ->update(['is_default_concentration' => 0]);

                // Set the chosen default
                $defaultVal = \App\Models\AttributeValue::where('attribute_id', $concAttr->id)
                    ->where('slug', $data['attr_default_concentration'])
                    ->first();
                if ($defaultVal) {
                    DB::table('product_attribute_value')
                        ->where('product_id', $record->id)
                        ->where('value_id', $defaultVal->id)
                        ->update(['is_default_concentration' => 1]);
                }
            }
        }
    }

    private function saveEavAttribute(\App\Models\Product $record, string $attrName, mixed $state, bool $multiple): void
    {
        $attr = \App\Models\Attribute::where('name', $attrName)->first();
        if (!$attr) return;

        // Remove existing assignments for this attribute
        DB::table('product_attribute_value')
            ->where('product_id', $record->id)
            ->whereIn('value_id', $attr->values->pluck('id'))
            ->delete();

        if ($multiple) {
            if (!empty($state) && is_array($state)) {
                $valIds = \App\Models\AttributeValue::where('attribute_id', $attr->id)
                    ->whereIn('slug', $state)
                    ->pluck('id');
                foreach ($valIds as $vId) {
                    DB::table('product_attribute_value')->insertOrIgnore([
                        'product_id' => $record->id,
                        'value_id'   => $vId,
                    ]);
                }
            }
        } else {
            if (!empty($state)) {
                $val = \App\Models\AttributeValue::where('attribute_id', $attr->id)
                    ->where('slug', $state)
                    ->first();
                if ($val) {
                    DB::table('product_attribute_value')->insertOrIgnore([
                        'product_id' => $record->id,
                        'value_id'   => $val->id,
                    ]);
                }
            }
        }
    }
}
