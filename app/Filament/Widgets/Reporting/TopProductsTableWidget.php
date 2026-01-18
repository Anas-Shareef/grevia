<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TopProductsTableWidget extends BaseWidget
{
    protected static ?string $heading = 'Top Selling Products';

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                OrderItem::query()
                    ->select(DB::raw('product_id as id'), 'product_id', DB::raw('sum(quantity) as total_qty'), DB::raw('sum(total) as total_revenue'))
                    ->groupBy('product_id')
                    ->orderByDesc('total_qty')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Product Name'),
                Tables\Columns\TextColumn::make('total_qty')
                    ->label('Units Sold'),
                Tables\Columns\TextColumn::make('total_revenue')
                    ->label('Revenue')
                    ->money('INR'),
            ])
            ->paginated(false);
    }
}
