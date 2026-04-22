<?php

namespace App\Filament\Resources\ParentCategoryResource\Tables;

use App\Models\Category;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ParentCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->withCount('children')->orderBy('order'))
            ->reorderable('order')
            ->defaultSort('order')
            ->columns([
                ImageColumn::make('image')
                    ->label('')
                    ->circular()
                    ->extraAttributes(['class' => 'rounded-full border shadow-sm']),
                
                TextColumn::make('name')
                    ->label('Category Name')
                    ->searchable()
                    ->sortable()
                    ->weight('black')
                    ->size('lg')
                    ->color('primary') // Primary is Forest Green #2E4D31
                    ->extraAttributes(['class' => 'uppercase tracking-wider font-outfit']),

                TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable()
                    ->color('gray')
                    ->size('xs')
                    ->fontFamily('mono')
                    ->hiddenFrom('md'),

                TextColumn::make('children_count')
                    ->label('Sub-categories')
                    ->badge()
                    ->color('success')
                    ->suffix(' Nested')
                    ->alignCenter()
                    ->extraHeaderAttributes(['style' => 'background-color: #F9F9EB; color: #729855; font-size: 10px; font-weight: 800; text-transform: uppercase;']),

                ToggleColumn::make('status')
                    ->label('Status')
                    ->onColor('success')
                    ->offColor('gray')
                    ->onIcon('heroicon-s-check-circle')
                    ->offIcon('heroicon-s-x-circle'),

                TextColumn::make('order')
                    ->label('Position')
                    ->badge()
                    ->color('gray')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                \Filament\Actions\EditAction::make()
                    ->button()
                    ->color('primary')
                    ->icon('heroicon-m-pencil-square'),
                \Filament\Actions\DeleteAction::make()
                    ->before(function ($record, $action) {
                        if ($record->children()->count() > 0) {
                            \Filament\Notifications\Notification::make()
                                ->danger()
                                ->title('Cannot delete Category')
                                ->body('This category has sub-categories. Please delete or reassign them first.')
                                ->send();
                            $action->cancel();
                        }
                    }),
            ]);
    }
}
