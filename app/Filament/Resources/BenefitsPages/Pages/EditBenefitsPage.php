<?php

namespace App\Filament\Resources\BenefitsPages\Pages;

use App\Filament\Resources\BenefitsPages\BenefitsPageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBenefitsPage extends EditRecord
{
    protected static string $resource = BenefitsPageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
