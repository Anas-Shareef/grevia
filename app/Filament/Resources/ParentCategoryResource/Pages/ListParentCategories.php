<?php

namespace App\Filament\Resources\ParentCategoryResource\Pages;

use App\Filament\Resources\ParentCategoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListParentCategories extends ListRecords
{
    protected static string $resource = ParentCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('ADD NEW PARENT')
                ->color('primary')
                ->icon('heroicon-o-plus-circle')
                ->extraAttributes(['class' => 'rounded-full px-6 shadow-md']),
        ];
    }
}
