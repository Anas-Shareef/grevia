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
            // Show setup button if any required column is missing
            Action::make('setup_banner_columns')
                ->label('⚙️ Fix: Set Up Banner Fields')
                ->color('warning')
                ->icon('heroicon-o-wrench')
                ->visible(fn () => !Schema::hasColumn('banners', 'description'))
                ->requiresConfirmation()
                ->modalHeading('Set Up Banner Fields?')
                ->modalDescription('This adds all required fields to your banners table: description, image, badge, buttons, and floating badges.')
                ->modalSubmitActionLabel('Yes, Fix Now')
                ->action(function () {
                    try {
                        // Add each column only if missing
                        $columns = [
                            'badge_text'             => "VARCHAR(255) NULL AFTER `title`",
                            'description'            => "TEXT NULL AFTER `badge_text`",
                            'primary_button_text'    => "VARCHAR(255) NULL",
                            'primary_button_link'    => "VARCHAR(255) NULL",
                            'secondary_button_text'  => "VARCHAR(255) NULL",
                            'secondary_button_link'  => "VARCHAR(255) NULL",
                            'features'               => "JSON NULL",
                        ];

                        foreach ($columns as $column => $definition) {
                            if (!Schema::hasColumn('banners', $column)) {
                                DB::statement("ALTER TABLE `banners` ADD COLUMN `{$column}` {$definition}");
                            }
                        }

                        \Illuminate\Support\Facades\Artisan::call('optimize:clear');

                        Notification::make()
                            ->title('✅ Done! All banner fields are set up.')
                            ->body('Reload this page and save your banner — changes will now appear on the homepage.')
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
