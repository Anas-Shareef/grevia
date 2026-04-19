<?php

namespace App\Filament\Resources\Categories\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->withCount(['products', 'childProducts']))
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                ImageColumn::make('image')
                    ->circular(),
                TextColumn::make('parent.name')
                    ->label('Parent')
                    ->sortable(),
                TextColumn::make('total_products_count')
                    ->label('Products')
                    ->state(function (\App\Models\Category $record): int {
                        return ((int) $record->products_count) + ((int) $record->child_products_count);
                    })
                    ->color(fn (int $state): ?string => $state === 0 ? 'danger' : null)
                    ->sortable(query: function (Builder $query, string $direction): Builder {
                        return $query->orderByRaw('(COALESCE(products_count, 0) + COALESCE(child_products_count, 0)) ' . $direction);
                    })
                    ->url(fn (\App\Models\Category $record): string => '/admin/products?tableFilters[category_id][value]=' . $record->id),
                IconColumn::make('status')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
                TextColumn::make('order')
                    ->numeric()
                    ->sortable(),
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
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
