<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;

    protected function afterCreate(): void
    {
        $record = $this->record;
        $data   = $this->data;

        if (!Schema::hasTable('product_attribute_value') || !Schema::hasTable('attribute_values')) {
            return;
        }

        $this->saveEavAttribute($record, 'format',       $data['attr_format'] ?? null,        false);
        $this->saveEavAttribute($record, 'concentration', $data['attr_concentration'] ?? [],   true);
        $this->saveEavAttribute($record, 'trust_badges',  $data['attr_trust_badges'] ?? [],    true);
    }

    private function saveEavAttribute(\App\Models\Product $record, string $attrName, mixed $state, bool $multiple): void
    {
        $attr = \App\Models\Attribute::where('name', $attrName)->first();
        if (!$attr) return;

        DB::table('product_attribute_value')
            ->where('product_id', $record->id)
            ->whereIn('value_id', $attr->values->pluck('id'))
            ->delete();

        if ($multiple) {
            if (!empty($state) && is_array($state)) {
                $valIds = \App\Models\AttributeValue::where('attribute_id', $attr->id)
                    ->whereIn('slug', $state)->pluck('id');
                foreach ($valIds as $vId) {
                    DB::table('product_attribute_value')->insertOrIgnore([
                        'product_id' => $record->id, 'value_id' => $vId,
                    ]);
                }
            }
        } else {
            if (!empty($state)) {
                $val = \App\Models\AttributeValue::where('attribute_id', $attr->id)
                    ->where('slug', $state)->first();
                if ($val) {
                    DB::table('product_attribute_value')->insertOrIgnore([
                        'product_id' => $record->id, 'value_id' => $val->id,
                    ]);
                }
            }
        }
    }
}
