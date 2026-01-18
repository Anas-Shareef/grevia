<?php

namespace App\Filament\Resources\AdminNotificationResource\Pages;

use App\Filament\Resources\AdminNotificationResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAdminNotifications extends ListRecords
{
    protected static string $resource = AdminNotificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('markAllRead')
                ->label('Mark All as Read')
                ->icon('heroicon-o-check-circle')
                ->action(function () {
                    \App\Models\AdminNotification::where('is_read', false)->update(['is_read' => true]);
                    \Filament\Notifications\Notification::make()
                        ->title('All notifications marked as read')
                        ->success()
                        ->send();
                }),
        ];
    }
}
