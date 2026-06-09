<?php


namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('role_label')
                    ->label('Role')
                    ->default('Customer')
                    ->badge()
                    ->color('success'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                Action::make('toggle_block')
                    ->label(fn ($record) => $record->is_blocked ? 'Unblock' : 'Block')
                    ->color(fn ($record) => $record->is_blocked ? 'success' : 'danger')
                    ->icon(fn ($record) => $record->is_blocked ? 'heroicon-o-lock-open' : 'heroicon-o-lock-closed')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->update(['is_blocked' => !$record->is_blocked]);
                    }),
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                Action::make('sync_mailerlite')
                    ->label('Sync all to MailerLite')
                    ->icon('heroicon-o-arrow-path')
                    ->color('info')
                    ->requiresConfirmation()
                    ->action(function () {
                        $count = (new \App\Services\MailerLiteService())->syncAllUsers();
                        if ($count !== false) {
                            \Filament\Notifications\Notification::make()
                                ->title("Successfully synced {$count} users to MailerLite.")
                                ->success()
                                ->send();
                        } else {
                            \Filament\Notifications\Notification::make()
                                ->title("MailerLite sync failed. Please check PHP/Laravel logs.")
                                ->danger()
                                ->send();
                        }
                    }),
                Action::make('export_excel')
                    ->label('Export Excel')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('success')
                    ->url(fn () => route('admin.export.users'))
                    ->openUrlInNewTab(),
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    \Filament\Actions\BulkAction::make('sync_selected_mailerlite')
                        ->label('Sync Selected to MailerLite')
                        ->icon('heroicon-o-arrow-path')
                        ->color('info')
                        ->action(function (\Illuminate\Support\Collection $records) {
                            $apiKey = config('services.mailerlite.api_key', '');
                            $groupCustomers = config('services.mailerlite.group_customers', '');
                            if (empty($apiKey) || empty($groupCustomers)) {
                                \Filament\Notifications\Notification::make()
                                    ->title("MailerLite API key or customers group not configured.")
                                    ->danger()
                                    ->send();
                                return;
                            }
                            $service = new \App\Services\MailerLiteService();
                            $count = 0;
                            foreach ($records as $user) {
                                $success = $service->subscribe(
                                    email: $user->email,
                                    name: $user->name,
                                    groups: [$groupCustomers],
                                    fields: [
                                        'registered_at' => $user->created_at->toIso8601String(),
                                    ]
                                );
                                if ($success) {
                                    $count++;
                                }
                                usleep(500000);
                            }
                            \Filament\Notifications\Notification::make()
                                ->title("Successfully synced {$count} of {$records->count()} selected users to MailerLite.")
                                ->success()
                                ->send();
                        }),
                ]),
            ]);
    }
}
