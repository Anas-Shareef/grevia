<?php

namespace App\Filament\Resources\Coupons\Tables;

use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Filament\Tables;

class CouponsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->label('Code')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->copyMessage('Coupon code copied!')
                    ->badge()
                    ->color('success')
                    ->weight(\Filament\Support\Enums\FontWeight::Bold),

                TextColumn::make('type')
                    ->label('Type')
                    ->formatStateUsing(fn ($state) => $state === 'percentage' ? 'Percentage' : 'Fixed Amount')
                    ->badge()
                    ->color(fn ($state) => $state === 'percentage' ? 'warning' : 'info'),

                TextColumn::make('value')
                    ->label('Discount')
                    ->formatStateUsing(fn ($state, $record) =>
                        $record->type === 'percentage'
                            ? $state . '%'
                            : '₹' . number_format($state, 0)
                    )
                    ->sortable(),

                TextColumn::make('min_order_value')
                    ->label('Min. Order')
                    ->formatStateUsing(fn ($state) => $state > 0 ? '₹' . number_format($state, 0) : '—')
                    ->sortable(),

                TextColumn::make('usage')
                    ->label('Usage')
                    ->getStateUsing(fn ($record) =>
                        $record->usage_count . ' / ' . ($record->usage_limit ?? '∞')
                    )
                    ->color(fn ($record) =>
                        $record->usage_limit && $record->usage_count >= $record->usage_limit
                            ? 'danger' : 'gray'
                    ),

                TextColumn::make('expiry_date')
                    ->label('Expires')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->placeholder('Never')
                    ->color(fn ($record) =>
                        $record->expiry_date && now()->isAfter($record->expiry_date) ? 'danger' : 'gray'
                    ),

                IconColumn::make('status')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
            ])
            ->filters([
                TernaryFilter::make('status')
                    ->label('Status')
                    ->placeholder('All Coupons')
                    ->trueLabel('Active Only')
                    ->falseLabel('Inactive Only'),

                SelectFilter::make('type')
                    ->label('Type')
                    ->options([
                        'fixed'      => 'Fixed Amount',
                        'percentage' => 'Percentage',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->emptyStateHeading('No coupons yet')
            ->emptyStateDescription('Create your first coupon to start offering discounts to customers.')
            ->emptyStateIcon('heroicon-o-tag');
    }
}
