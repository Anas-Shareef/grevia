<?php

namespace App\Filament\Resources\Users\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Schemas\Schema;

class AddressesRelationManager extends RelationManager
{
    protected static string $relationship = 'addresses';

    protected static ?string $title = 'Addresses';

    public function form(Schema $schema): Schema
    {
         return $schema
            ->components([
                \Filament\Schemas\Components\Section::make('Address Details')
                    ->columns(2)
                    ->components([
                        \Filament\Forms\Components\TextInput::make('first_name')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('last_name')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('phone')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('company')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('address_line_1')
                            ->columnSpanFull()
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('address_line_2')
                            ->columnSpanFull()
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('city')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('state')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('pincode')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('country')
                            ->disabled(),
                    ]),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('address_line_1')
            ->columns([
                Tables\Columns\TextColumn::make('first_name')->label('Name')->formatStateUsing(fn ($record) => $record->first_name . ' ' . $record->last_name),
                Tables\Columns\TextColumn::make('address_line_1')->label('Address')->limit(30),
                Tables\Columns\TextColumn::make('city'),
                Tables\Columns\TextColumn::make('state'),
                Tables\Columns\TextColumn::make('pincode'),
                Tables\Columns\IconColumn::make('is_default_shipping')->boolean()->label('Default Shipping'),
                Tables\Columns\IconColumn::make('is_default_billing')->boolean()->label('Default Billing'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ]);
    }
}
