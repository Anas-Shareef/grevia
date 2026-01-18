<?php

namespace App\Filament\Resources\Shipments;

use App\Filament\Resources\Shipments\Pages\CreateShipment;
use App\Filament\Resources\Shipments\Pages\EditShipment;
use App\Filament\Resources\Shipments\Pages\ListShipments;
use App\Filament\Resources\Shipments\Pages\ViewShipment;
use App\Filament\Resources\Shipments\Schemas\ShipmentForm;
use App\Filament\Resources\Shipments\Schemas\ShipmentInfolist;
use App\Filament\Resources\Shipments\Tables\ShipmentsTable;
use App\Models\Shipment;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class ShipmentResource extends Resource
{
    protected static ?string $model = Shipment::class;

    // Icon removed - parent group 'Sales' has icon
    // protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Sales';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'tracking_number';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                 \Filament\Schemas\Components\Section::make('Shipment Details')
                    ->columns(2)
                    ->components([
                        \Filament\Forms\Components\TextInput::make('order.order_number')
                            ->label('Order Number')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('courier_name')
                            ->required(),
                        \Filament\Forms\Components\TextInput::make('tracking_number')
                            ->required(),
                        \Filament\Forms\Components\TextInput::make('tracking_url')
                            ->url()
                            ->suffixIcon('heroicon-m-globe-alt'),
                        \Filament\Forms\Components\DateTimePicker::make('shipped_at')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('shipment_status')
                            ->disabled(),
                    ]),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ShipmentInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ShipmentsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListShipments::route('/'),
            'view' => ViewShipment::route('/{record}'),
        ];
    }
}
