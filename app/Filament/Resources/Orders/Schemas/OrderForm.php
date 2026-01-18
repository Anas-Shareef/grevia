<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Order Status')
                    ->components([
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'processing' => 'Processing',
                                'shipped' => 'Shipped',
                                'delivered' => 'Delivered',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                                'refunded' => 'Refunded',
                            ])
                            ->required()
                            ->native(false),
                        Select::make('payment_status')
                            ->options([
                                'pending' => 'Pending',
                                'paid' => 'Paid',
                                'failed' => 'Failed',
                                'refunded' => 'Refunded',
                            ])
                            ->required()
                            ->disabled() // Managed via Payment Gateway or manual Invoice action
                            ->dehydrated(false)
                            ->native(false),
                    ])->columns(2),

                Section::make('Customer Information')
                    ->columns(2)
                    ->components([
                        TextInput::make('name')
                            ->disabled(),
                        TextInput::make('email')
                            ->disabled(),
                        TextInput::make('phone')
                            ->disabled(),
                        TextInput::make('payment_method')
                            ->disabled(),
                        TextInput::make('payment_reference')
                            ->label('Razorpay Payment ID')
                            ->disabled(),
                    ]),

                Section::make('Shipping Address')
                    ->columns(2)
                    ->components([
                        TextInput::make('address')
                            ->columnSpanFull()
                            ->disabled(),
                        TextInput::make('city')
                            ->disabled(),
                        TextInput::make('state')
                            ->disabled(),
                        TextInput::make('pincode')
                            ->disabled(),
                    ]),

                Section::make('Order Totals')
                    ->columns(3)
                    ->components([
                        TextInput::make('subtotal')
                            ->prefix('₹')
                            ->disabled(),
                        TextInput::make('discount')
                            ->prefix('₹')
                            ->disabled(),
                        TextInput::make('total')
                            ->prefix('₹')
                            ->disabled()
                            ->label('Grand Total'),
                    ]),
            ]);
    }
}
