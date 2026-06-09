<?php

namespace App\Filament\Resources\Subscribers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use App\Models\Subscriber;

class SubscribersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('email')
                    ->label('Email address')
                    ->searchable(),
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('user_id')
                    ->numeric()
                    ->sortable(),
                IconColumn::make('is_subscribed')
                    ->boolean(),
                TextColumn::make('source')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'popup' => 'info',
                        'footer' => 'success',
                        'register' => 'warning',
                        'auto' => 'gray',
                        default => 'gray',
                    })
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                EditAction::make(),
                \Filament\Actions\Action::make('unsubscribe')
                    ->label('Unsubscribe')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (Subscriber $record) => $record->is_subscribed)
                    ->action(fn (Subscriber $record) => $record->update(['is_subscribed' => false])),
                \Filament\Actions\Action::make('resubscribe')
                    ->label('Resubscribe')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (Subscriber $record) => !$record->is_subscribed)
                    ->action(fn (Subscriber $record) => $record->update(['is_subscribed' => true])),
            ])
            ->toolbarActions([
                \Filament\Actions\Action::make('sync_mailerlite')
                    ->label('Sync all to MailerLite')
                    ->icon('heroicon-o-arrow-path')
                    ->color('info')
                    ->requiresConfirmation()
                    ->action(function () {
                        $count = (new \App\Services\MailerLiteService())->syncAllSubscribers();
                        if ($count !== false) {
                            \Filament\Notifications\Notification::make()
                                ->title("Successfully synced {$count} subscribers to MailerLite.")
                                ->success()
                                ->send();
                        } else {
                            \Filament\Notifications\Notification::make()
                                ->title("MailerLite sync failed. Please check PHP/Laravel logs.")
                                ->danger()
                                ->send();
                        }
                    }),
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                    \Filament\Actions\BulkAction::make('sync_selected_mailerlite')
                        ->label('Sync Selected to MailerLite')
                        ->icon('heroicon-o-arrow-path')
                        ->color('info')
                        ->action(function (\Illuminate\Support\Collection $records) {
                            $apiKey = config('services.mailerlite.api_key', '');
                            $groupSubscribers = config('services.mailerlite.group_subscribers', '');
                            if (empty($apiKey) || empty($groupSubscribers)) {
                                \Filament\Notifications\Notification::make()
                                    ->title("MailerLite API key or subscribers group not configured.")
                                    ->danger()
                                    ->send();
                                return;
                            }
                            $service = new \App\Services\MailerLiteService();
                            $count = 0;
                            foreach ($records as $subscriber) {
                                if (!$subscriber->is_subscribed) {
                                    $service->unsubscribe($subscriber->email);
                                    continue;
                                }
                                $success = $service->subscribe(
                                    email: $subscriber->email,
                                    name: $subscriber->name ?? '',
                                    groups: [$groupSubscribers],
                                    fields: [
                                        'source' => $subscriber->source ?? 'unknown',
                                    ]
                                );
                                if ($success) {
                                    $count++;
                                }
                                usleep(500000);
                            }
                            \Filament\Notifications\Notification::make()
                                ->title("Successfully synced {$count} of {$records->count()} selected subscribers to MailerLite.")
                                ->success()
                                ->send();
                        }),
                ]),
            ]);
    }
}
