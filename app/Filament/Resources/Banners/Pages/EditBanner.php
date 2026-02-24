<?php

namespace App\Filament\Resources\Banners\Pages;

use App\Filament\Resources\Banners\BannerResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBanner extends EditRecord
{
    protected static string $resource = BannerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Live preview button — opens the homepage in a new tab
            Action::make('preview')
                ->label('👁 Preview on Homepage')
                ->color('gray')
                ->icon('heroicon-o-arrow-top-right-on-square')
                ->url('https://grevia.in/', shouldOpenInNewTab: true),

            DeleteAction::make(),
        ];
    }
}
