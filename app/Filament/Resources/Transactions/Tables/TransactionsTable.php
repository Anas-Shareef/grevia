<?php

namespace App\Filament\Resources\Transactions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

class TransactionsTable
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
                                \pxlrbt\FilamentExcel\Columns\Column::make('transaction_id')->heading('Transaction ID'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('order.order_number')->heading('Order #'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('payment_method')->heading('Method'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('type')->heading('Type'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('amount')->heading('Amount'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('status')->heading('Status'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('created_at')->heading('Date'),
                            ]),
                    ]),
            ])
            ->columns([
                TextColumn::make('order.order_number')
                    ->label('Order #')
                    ->searchable()
                    ->sortable()
                    ->url(fn ($record) => route('filament.admin.resources.orders.view', $record->order_id)),
                TextColumn::make('order.id')
                    ->label('Serial #')
                    ->prefix('#')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('transaction_id')
                    ->label('Transaction ID')
                    ->searchable(),
                TextColumn::make('payment_method')
                    ->searchable(),
                TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'capture' => 'success',
                        'refund' => 'warning',
                        'void' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('amount')
                    ->money('INR')
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                \Filament\Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'capture' => 'Capture',
                        'refund' => 'Refund',
                        'void' => 'Void',
                    ]),
                \Filament\Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'paid' => 'Paid',
                        'pending' => 'Pending',
                        'failed' => 'Failed',
                    ]),
            ])
            ->actions([
                ViewAction::make(),
            ])
            ->bulkActions([
                // Read-only
            ]);
    }
}
