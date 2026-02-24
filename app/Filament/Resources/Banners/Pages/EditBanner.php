<?php

namespace App\Filament\Resources\Banners\Pages;

use App\Filament\Resources\Banners\BannerResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EditBanner extends EditRecord
{
    protected static string $resource = BannerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Show setup button only if badge_text column is missing
            Action::make('setup_badge_text')
                ->label('⚙️ Fix: Add Badge Text Field')
                ->color('warning')
                ->icon('heroicon-o-wrench')
                ->visible(fn () => !Schema::hasColumn('banners', 'badge_text'))
                ->requiresConfirmation()
                ->modalHeading('Add Badge Text to Banners?')
                ->modalDescription('This will add a "Badge Text" field to the banners table so you can edit the green label above the headline.')
                ->modalSubmitActionLabel('Yes, Fix Now')
                ->action(function () {
                    try {
                        if (!Schema::hasColumn('banners', 'badge_text')) {
                            DB::statement("ALTER TABLE `banners` ADD COLUMN `badge_text` VARCHAR(255) NULL AFTER `title`");
                        }

                        \Illuminate\Support\Facades\Artisan::call('optimize:clear');

                        Notification::make()
                            ->title('✅ Done! Reload this page to use the Badge Text field.')
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

            // Live preview button
            Action::make('preview')
                ->label('👁 Preview on Homepage')
                ->color('gray')
                ->icon('heroicon-o-arrow-top-right-on-square')
                ->url('https://grevia.in/', shouldOpenInNewTab: true),

            DeleteAction::make(),
        ];
    }
}
