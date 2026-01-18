<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

class OrdersTable
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
                                \pxlrbt\FilamentExcel\Columns\Column::make('id')->heading('Order ID'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('name')->heading('Customer'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('total')->heading('Total'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('status')->heading('Status'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('payment_status')->heading('Payment Status'),
                                \pxlrbt\FilamentExcel\Columns\Column::make('created_at')->heading('Date'),
                            ]),
                    ]),
            ])
            ->columns([
                TextColumn::make('items_preview')
                    ->label('Items')
                    ->state(function (Model $record): string {
                        $items = $record->orderItems->load(['product']);
                        $html = '<div class="flex flex-col gap-2 py-1">';
                        
                        foreach ($items as $item) {
                            $product = $item->product;
                            // Check for image in array or single field
                            $imageUrl = null;
                            if ($product) {
                                if ($product->images && is_array($product->images) && count($product->images) > 0) {
                                    $imageUrl = asset('storage/' . $product->images[0]);
                                } elseif ($product->image) {
                                    $imageUrl = asset('storage/' . $product->image);
                                }
                            }
                            
                            $displayImage = $imageUrl ?: 'https://placehold.co/40x40/f1f5f9/64748b?text=IMG';
                            $productName = $product ? $product->name : 'Unknown Product (' . $item->name . ')';
                            $sku = $product ? $product->sku : 'N/A';

                            $html .= '<div class="flex items-start gap-3 min-w-[200px]">';
                            
                            // Thumbnail
                            $html .= '<img src="' . $displayImage . '" 
                                          style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" 
                                          class="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0" 
                                          alt="Product">';
                            
                            $html .= '<div class="flex flex-col leading-tight">';
                            // Product Name
                            $html .= '<span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[250px]" title="' . $productName . '">' . $productName . '</span>';
                            
                            // SKU and Qty
                            $html .= '<span class="text-xs text-gray-500 dark:text-gray-400">SKU: ' . $sku . ' • Qty: ' . $item->quantity . '</span>';
                            $html .= '</div>';
                            
                            $html .= '</div>';
                        }
                        
                        if ($items->count() === 0) {
                            $html .= '<span class="text-xs text-gray-400 italic">No items</span>';
                        }
                        
                        $html .= '</div>';
                        return $html;
                    })
                    ->html(),

                TextColumn::make('order_number')
                    ->label('Order #')
                    ->searchable()
                    ->sortable()
                    ->copyable(),


                TextColumn::make('name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('total')
                    ->money('INR')
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'processing' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'paid' => 'success',
                        'failed' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
