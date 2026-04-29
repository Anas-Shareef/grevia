<?php

namespace App\Filament\Resources\Attributes\Pages;

use App\Filament\Resources\Attributes\AttributeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAttribute extends EditRecord
{
    protected static string $resource = AttributeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()
                ->before(function ($record, $action) {
                    $usageCount = \DB::table('product_attribute_value')->whereIn('value_id', $record->values->pluck('id'))->count();
                    if ($usageCount > 0) {
                        \Filament\Notifications\Notification::make()
                            ->title('Cannot Delete Attribute')
                            ->body("This attribute is assigned to {$usageCount} products. Unassign it first.")
                            ->danger()
                            ->send();
                        $action->cancel();
                    }
                }),
        ];
    }
}
