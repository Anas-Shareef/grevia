<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

class LowPerformingProductsTableWidget extends BaseWidget
{
    protected static ?string $heading = 'Low Performing Products';
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->withSum('orderItems', 'quantity')
                    ->orderBy('order_items_sum_quantity', 'asc') // Nulls sort first/last? Usually 0 is last. We want low sales.
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Product Name'),
                Tables\Columns\TextColumn::make('order_items_sum_quantity')
                    ->label('Total Units Sold')
                    ->default(0),
                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->money('INR'),
            ])
            ->paginated(false);
    }
}
