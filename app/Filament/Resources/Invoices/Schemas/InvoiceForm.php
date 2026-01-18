<?php

namespace App\Filament\Resources\Invoices\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class InvoiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Section::make('Invoice Details')
                    ->columns(2)
                    ->components([
                        TextInput::make('invoice_number')
                            ->disabled()
                            ->required(),
                        TextInput::make('order.order_number')
                            ->label('Order Number')
                            ->disabled()
                            ->required(),
                        \Filament\Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'paid' => 'Paid',
                                'cancelled' => 'Cancelled',
                            ])
                            ->required(),
                        DateTimePicker::make('issued_at')
                            ->required(),
                    ]),
                \Filament\Schemas\Components\Section::make('Summary')
                    ->columns(4)
                    ->components([
                        TextInput::make('subtotal')
                            ->prefix('₹')
                            ->disabled(),
                        TextInput::make('tax')
                            ->prefix('₹')
                            ->disabled(),
                        TextInput::make('discount')
                            ->prefix('₹')
                            ->disabled(),
                        TextInput::make('total')
                            ->prefix('₹')
                            ->disabled(),
                    ]),
            ]);
    }
}
