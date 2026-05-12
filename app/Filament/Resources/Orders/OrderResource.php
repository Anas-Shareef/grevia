<?php

namespace App\Filament\Resources\Orders;

use App\Filament\Resources\Orders\Pages\CreateOrder;
use App\Filament\Resources\Orders\Pages\ListOrders;
use App\Filament\Resources\Orders\Pages;
use App\Filament\Resources\Orders\Schemas\OrderForm;
use App\Filament\Resources\Orders\Tables\OrdersTable;
use App\Models\Order;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Infolists;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\RepeatableEntry;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static string|\UnitEnum|null $navigationGroup = 'Sales';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return OrderForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OrdersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            OrderResource\RelationManagers\StatusHistoryRelationManager::class,
            OrderResource\RelationManagers\ShipmentsRelationManager::class,
            OrderResource\RelationManagers\RefundsRelationManager::class,
            RelationManagers\TransactionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListOrders::route('/'),
            'create' => CreateOrder::route('/create'),
            'view' => Pages\ViewOrder::route('/{record}'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->schema([
            Section::make('Order Items')
                ->description('Products included in this order')
                ->schema([

                    RepeatableEntry::make('orderItems')
                        ->label('')
                        ->contained(false)
                        ->schema([

                            Grid::make(12)->schema([

                                /* ================= IMAGE ================= */
                                ImageEntry::make('product.image')
                                    ->label('')
                                    ->columnSpan(2)
                                    ->height(80)
                                    ->square()
                                    ->getStateUsing(fn ($record) =>
                                        $record->product?->image
                                            ? asset('storage/' . $record->product->image)
                                            : null
                                    ),

                                /* ================= DETAILS ================= */
                                Grid::make(1)
                                    ->columnSpan(6)
                                    ->schema([

                                        TextEntry::make('product.name')
                                            ->label('')
                                            ->size('lg')
                                            ->weight('bold')
                                            ->default(fn ($record) => $record->name),

                                        TextEntry::make('price')
                                            ->label('Price per unit')
                                            ->money('INR'),

                                        TextEntry::make('quantity')
                                            ->label('Quantity'),

                                        TextEntry::make('product.sku')
                                            ->label('SKU')
                                            ->default('N/A'),

                                        TextEntry::make('lifecycle')
                                            ->label('Order Status')
                                            ->state(function ($record) {

                                                $ordered  = $record->quantity;
                                                $invoiced = $record->invoiced_quantity ?? 0;
                                                $shipped  = $record->shipped_quantity ?? 0;
                                                $refunded = $record->refunded_quantity ?? 0;

                                                return "Ordered ($ordered) · Invoiced ($invoiced) · Shipped ($shipped) · Refunded ($refunded)";
                                            }),
                                    ]),

                                /* ================= TOTAL ================= */
                                Grid::make(1)
                                    ->columnSpan(4)
                                    ->schema([

                                        TextEntry::make('total')
                                            ->label('Sub Total')
                                            ->money('INR')
                                            ->size('lg')
                                            ->weight('bold'),
                                    ]),
                            ]),
                        ]),
                ])
                ->collapsible(),
        ]);
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }
}
