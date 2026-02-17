<?php

namespace App\Filament\Resources\EmailCampaigns\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns;
use Filament\Tables\Table;

class EmailCampaignsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                    
                Columns\TextColumn::make('subject')
                    ->searchable()
                    ->limit(40)
                    ->tooltip(function (Columns\TextColumn $column): ?string {
                        $state = $column->getState();
                        if (strlen($state) > 40) {
                            return $state;
                        }
                        return null;
                    }),
                    
                Columns\TextColumn::make('target_segment')
                    ->label('Segment')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => 
                        \App\Services\EmailSegmentationService::getAvailableSegments()[$state]['label'] ?? $state
                    )
                    ->color('primary'),
                    
                Columns\TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'secondary' => 'draft',
                        'warning' => 'sending',
                        'success' => 'sent',
                        'danger' => 'failed',
                    ]),
                    
                Columns\TextColumn::make('progress')
                    ->label('Progress')
                    ->formatStateUsing(function ($record) {
                        if ($record->total_recipients === 0) {
                            return '0 recipients';
                        }
                        $sent = $record->sent_count ?? 0;
                        $failed = $record->failed_count ?? 0;
                        $total = $record->total_recipients;
                        $percentage = $total > 0 ? round((($sent + $failed) / $total) * 100) : 0;
                        
                        if ($record->status === 'draft') {
                            return "{$total} recipients";
                        }
                        
                        return "✓ {$sent} / ✗ {$failed} / {$total} ({$percentage}%)";
                    })
                    ->color(fn ($record) => 
                        $record->failed_count > 0 ? 'warning' : 
                        ($record->status === 'sent' ? 'success' : 'gray')
                    ),
                    
                Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M j, Y')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
