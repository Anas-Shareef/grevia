<?php

namespace App\Filament\Resources\Refunds\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class RefundForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_id')
                    ->required()
                    ->numeric(),
                TextInput::make('invoice_id')
                    ->numeric(),
                TextInput::make('amount')
                    ->required()
                    ->numeric(),
                Textarea::make('reason')
                    ->columnSpanFull(),
                TextInput::make('status')
                    ->required()
                    ->default('initiated'),
                TextInput::make('gateway'),
                TextInput::make('gateway_refund_id'),
                DateTimePicker::make('processed_at'),
            ]);
    }
}
