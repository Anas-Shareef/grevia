<?php

namespace App\Filament\Resources\Shipments\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

class ShipmentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->headerActions([
                ExportAction::make()
                    ->exports([
                        ExcelExport::make()
                            ->withFilename(fn ($resource) => $resource::getModelLabel() . '-' . date('Y-m-d'))
                            ->withColumns([
                                \pxlrbt\FilamentExcel\Columns\Column::make('order.order_number')->heading('Order #'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('courier_name')->heading('Courier'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('tracking_number')->heading('Tracking #'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('shipment_status')->heading('Status'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('shipped_at')->heading('Shipped At'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('delivered_at')->heading('Delivered At'),
                            ]),
                    ]),
            ])
            ->columns([
                TextColumn::make('order.order_number')
                    ->label('Order #')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('order.id')
                    ->label('Serial #')
                    ->prefix('#')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('courier_name')
                    ->searchable(),
                TextColumn::make('tracking_number')
                    ->searchable(),
                TextColumn::make('tracking_url')
                    ->searchable(),
                TextColumn::make('shipment_status')
                    ->searchable(),
                TextColumn::make('shipped_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('delivered_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
