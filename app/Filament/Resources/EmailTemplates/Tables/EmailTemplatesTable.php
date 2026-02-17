<?php

namespace App\Filament\Resources\EmailTemplates\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class EmailTemplatesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                
                TextColumn::make('slug')
                    ->searchable()
                    ->copyable()
                    ->badge()
                    ->color('gray'),
                
                TextColumn::make('subject')
                    ->searchable()
                    ->limit(50)
                    ->tooltip(fn ($record) => $record->subject),
                
                IconColumn::make('status')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
                
                TextColumn::make('campaigns_count')
                    ->label('Campaigns')
                    ->counts('campaigns')
                    ->badge()
                    ->color('success'),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->before(function ($records) {
                            foreach ($records as $record) {
                                if (!$record->canDelete()) {
                                    throw new \Exception("Cannot delete template '{$record->name}' as it is being used by campaigns or events.");
                                }
                            }
                        }),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
