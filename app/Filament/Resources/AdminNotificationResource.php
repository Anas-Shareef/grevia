<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AdminNotificationResource\Pages;
use App\Models\AdminNotification;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class AdminNotificationResource extends Resource
{
    protected static ?string $model = AdminNotification::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-bell';

    protected static string | \UnitEnum | null $navigationGroup = 'System';
    
    protected static ?string $modelLabel = 'Notification';

    public static function canCreate(): bool
    {
        return false; // Disable manual creation
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\IconColumn::make('icon')
                    ->icon(fn (string $state): string => $state)
                    ->color(fn (AdminNotification $record): string => $record->icon_color),
                
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->weight('bold')
                    ->description(fn (AdminNotification $record): string => $record->message),
                
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->colors([
                        'warning' => 'order',
                        'success' => 'customer',
                        'primary' => 'system',
                        'danger' => 'payment',
                    ]),

                Tables\Columns\IconColumn::make('is_read')
                    ->label('Read')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->color(fn (string $state): string => $state ? 'success' : 'gray'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\Filter::make('unread')
                    ->query(fn (Builder $query): Builder => $query->where('is_read', false))
                    ->label('Unread Only')
                    ->default(), // Default to showing unread? Maybe not.
            ])
            ->actions([
                Action::make('markAsRead')
                    ->label('Mark Read')
                    ->icon('heroicon-o-check')
                    ->visible(fn (AdminNotification $record) => !$record->is_read)
                    ->action(fn (AdminNotification $record) => $record->update(['is_read' => true])),
                
                Action::make('view')
                    ->label('View')
                    ->url(fn (AdminNotification $record) => $record->action_url)
                    ->icon('heroicon-o-eye')
                    ->openUrlInNewTab(false)
                    ->action(function (AdminNotification $record) {
                        $record->update(['is_read' => true]);
                        return redirect($record->action_url);
                    }),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    BulkAction::make('markRead')
                        ->label('Mark as Read')
                        ->icon('heroicon-o-check-circle')
                        ->action(fn (mixed $records) => $records->each->update(['is_read' => true]))
                        ->deselectRecordsAfterCompletion(),
                    
                    DeleteBulkAction::make(),
                ]),
            ])
            ->recordUrl(fn (AdminNotification $record) => $record->action_url); // Clicking row goes to action
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAdminNotifications::route('/'),
        ];
    }
}
