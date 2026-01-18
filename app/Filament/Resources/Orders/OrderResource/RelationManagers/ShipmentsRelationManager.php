<?php

namespace App\Filament\Resources\Orders\OrderResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Schemas\Schema;

class ShipmentsRelationManager extends RelationManager
{
    protected static string $relationship = 'shipments';

    protected static ?string $title = 'Shipments';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                 // Read only view
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('tracking_number')
            ->columns([
                Tables\Columns\TextColumn::make('courier_name'),
                Tables\Columns\TextColumn::make('tracking_number'),
                Tables\Columns\TextColumn::make('shipped_at')
                    ->dateTime(),
                Tables\Columns\TextColumn::make('shipment_status')
                    ->badge(),
            ])
            ->actions([
                // \Filament\Actions\ViewAction::make(),
            ]);
    }
}
