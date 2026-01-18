<?php

namespace App\Filament\Resources\Invoices\InvoiceResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Schemas\Schema;

class InvoiceItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    protected static ?string $title = 'Invoice Items';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Read-only
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('product_name')
            ->columns([
                Tables\Columns\TextColumn::make('product_name')
                    ->label('Product'),
                Tables\Columns\TextColumn::make('sku')
                    ->label('SKU'),
                Tables\Columns\TextColumn::make('price')
                    ->money('INR'),
                Tables\Columns\TextColumn::make('quantity'),
                Tables\Columns\TextColumn::make('total')
                    ->money('INR'),
            ])
            ->headerActions([
                // No create
            ])
            ->actions([
                // No edit
            ])
            ->bulkActions([
                // No delete
            ]);
    }
}
