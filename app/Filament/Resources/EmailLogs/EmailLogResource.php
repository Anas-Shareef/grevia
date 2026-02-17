<?php

namespace App\Filament\Resources\EmailLogs;

use App\Filament\Resources\EmailLogs\Pages\ListEmailLogs;
use App\Models\EmailLog;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class EmailLogResource extends Resource
{
    protected static ?string $model = EmailLog::class;
    
    protected static string|\UnitEnum|null $navigationGroup = 'Marketing';
    
    protected static ?int $navigationSort = 3;

    protected static ?string $navigationLabel = 'Email Logs';
    
    // Prevent access until migrations are run
    public static function canAccess(): bool
    {
        try {
            return \Schema::hasTable('email_logs');
        } catch (\Exception $e) {
            return false;
        }
    }
    
    public static function canViewAny(): bool
    {
        return static::canAccess();
    }
    
    public static function shouldRegisterNavigation(): bool
    {
        return static::canAccess();
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                    
                Tables\Columns\TextColumn::make('campaign.title')
                    ->label('Campaign')
                    ->searchable()
                    ->sortable()
                    ->limit(30)
                    ->default('—'),
                    
                Tables\Columns\TextColumn::make('template.name')
                    ->label('Template')
                    ->searchable()
                    ->limit(30)
                    ->default('—'),
                    
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'sent',
                        'danger' => 'failed',
                    ])
                    ->sortable(),
                    
                Tables\Columns\TextColumn::make('sent_at')
                    ->label('Sent')
                    ->dateTime('M j, Y H:i')
                    ->sortable()
                    ->default('—'),
                    
                Tables\Columns\TextColumn::make('error_message')
                    ->label('Error')
                    ->limit(50)
                    ->tooltip(function (Tables\Columns\TextColumn $column): ?string {
                        $state = $column->getState();
                        if ($state && strlen($state) > 50) {
                            return $state;
                        }
                        return null;
                    })
                    ->color('danger')
                    ->default('—'),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Queued')
                    ->dateTime('M j, Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'sent' => 'Sent',
                        'failed' => 'Failed',
                    ]),
                    
                Tables\Filters\SelectFilter::make('campaign_id')
                    ->label('Campaign')
                    ->relationship('campaign', 'title')
                    ->searchable()
                    ->preload(),
                    
                Tables\Filters\Filter::make('sent_at')
                    ->form([
                        \Filament\Forms\Components\DatePicker::make('sent_from')
                            ->label('Sent from'),
                        \Filament\Forms\Components\DatePicker::make('sent_until')
                            ->label('Sent until'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['sent_from'], fn ($q, $date) => $q->whereDate('sent_at', '>=', $date))
                            ->when($data['sent_until'], fn ($q, $date) => $q->whereDate('sent_at', '<=', $date));
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListEmailLogs::route('/'),
        ];
    }
}
