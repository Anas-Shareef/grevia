<?php

namespace App\Filament\Resources\BenefitsPages\Pages;

use App\Filament\Resources\BenefitsPages\BenefitsPageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBenefitsPages extends ListRecords
{
    protected static string $resource = BenefitsPageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
