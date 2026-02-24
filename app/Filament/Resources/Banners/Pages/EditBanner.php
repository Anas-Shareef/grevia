<?php

namespace App\Filament\Resources\Banners\Pages;

use App\Filament\Resources\Banners\BannerResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EditBanner extends EditRecord
{
    protected static string $resource = BannerResource::class;

    /**
     * Auto-setup missing columns every time the page is opened.
     * This way the user never needs to click any setup button.
     */
    public function mount(int|string $record): void
    {
        $this->ensureBannerColumns();
        parent::mount($record);
    }

    private function ensureBannerColumns(): void
    {
        $columns = [
            'badge_text'            => "VARCHAR(255) NULL",
            'description'           => "TEXT NULL",
            'primary_button_text'   => "VARCHAR(255) NULL",
            'primary_button_link'   => "VARCHAR(255) NULL",
            'secondary_button_text' => "VARCHAR(255) NULL",
            'secondary_button_link' => "VARCHAR(255) NULL",
            'features'              => "JSON NULL",
        ];

        foreach ($columns as $col => $definition) {
            if (!Schema::hasColumn('banners', $col)) {
                DB::statement("ALTER TABLE `banners` ADD COLUMN `{$col}` {$definition}");
            }
        }
    }

    /**
     * Always force type=hero and status=active on save.
     * The Settings section is removed from the form — these are hardcoded.
     */
    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data['type']   = 'hero';
        $data['status'] = true;
        return $data;
    }

    protected function getHeaderActions(): array
    {
        return [
            // Preview button to see changes live
            Action::make('preview')
                ->label('👁 Preview Homepage')
                ->color('gray')
                ->icon('heroicon-o-arrow-top-right-on-square')
                ->url('https://grevia.in/', shouldOpenInNewTab: true),

            DeleteAction::make(),
        ];
    }
}
