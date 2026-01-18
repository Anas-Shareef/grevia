<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\View;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns([
                'default' => 1,
                'lg' => 3,
            ])
            ->components([
                // LEFT COLUMN (Main Content - 2/3 width)
                Group::make()
                    ->schema([
                        // Order Items
                        Section::make('Order Items')
                            ->schema([
                                View::make('filament.infolists.order-items'),
                            ])
                            ->collapsible()
                            ->columnSpanFull(),

                        // Order Lifecycle Timeline
                        Section::make('Order Lifecycle')
                            ->schema([
                                View::make('filament.infolists.order-status-timeline'),
                            ])
                            ->collapsible()
                            ->collapsed()
                            ->columnSpanFull(),



                    ])
                    ->columnSpan([
                        'default' => 1,
                        'lg' => 2,
                    ]),

                // RIGHT SIDEBAR (1/3 width)
                Group::make()
                    ->schema([
                        // Customer Information
                        Section::make('Customer')
                            ->schema([
                                View::make('filament.infolists.customer-info'),
                            ])
                            ->collapsible(),

                        // Billing Address
                        Section::make('Billing Address')
                            ->schema([
                                View::make('filament.infolists.address-block')
                                    ->viewData(fn ($record) => ['address' => $record->billing_address]),
                            ])
                            ->collapsible(),

                        // Shipping Address
                        Section::make('Shipping Address')
                            ->schema([
                                View::make('filament.infolists.address-block')
                                    ->viewData(fn ($record) => ['address' => $record->shipping_address]),
                            ])
                            ->collapsible(),

                        // Order Information (NEW)
                        Section::make('Order Information')
                            ->schema([
                                View::make('filament.infolists.order-info'),
                            ])
                            ->collapsible(),

                        // Payment and Shipping (COMBINED)
                        Section::make('Payment and Shipping')
                            ->schema([
                                View::make('filament.infolists.payment-shipping'),
                            ])
                            ->collapsible(),

                        // Invoices
                        Section::make('Invoices')
                            ->schema([
                                View::make('filament.infolists.invoices'),
                            ])
                            ->collapsible(),

                        // Shipments
                        Section::make('Shipments')
                            ->schema([
                                View::make('filament.infolists.shipments'),
                            ])
                            ->visible(fn ($record) => $record->shipments->count() > 0)
                            ->collapsible()
                            ->collapsed(),

                        // Refunds
                        Section::make('Refunds')
                            ->schema([
                                View::make('filament.infolists.refunds'),
                            ])
                            ->visible(fn ($record) => $record->refunds->count() > 0)
                            ->collapsible()
                            ->collapsed(),
                    ])
                    ->columnSpan([
                        'default' => 1,
                        'lg' => 1,
                    ]),
            ]);
    }
}
