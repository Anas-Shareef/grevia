<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Product;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        // Simple global stats for now as product inventory is state-based, not strictly time-based
        // But Sales Volume is time-based
        $range = request()->query('date_range', '30d');
        $startDate = request()->query('start_date');
        $endDate = request()->query('end_date');

        // Total Sold (Units) in period
        $soldQuery = OrderItem::query();
        if ($range === 'today') {
            $soldQuery->whereDate('created_at', Carbon::today());
        } elseif ($range === '7d') {
            $soldQuery->where('created_at', '>=', Carbon::now()->subDays(7));
        } elseif ($range === '30d') {
            $soldQuery->where('created_at', '>=', Carbon::now()->subDays(30));
        } elseif ($range === 'month') {
            $soldQuery->whereMonth('created_at', Carbon::now()->month)
                      ->whereYear('created_at', Carbon::now()->year);
        } elseif ($range === 'custom' && $startDate && $endDate) {
            $soldQuery->whereBetween('created_at', [Carbon::parse($startDate), Carbon::parse($endDate)]);
        }
        $totalUnitsSold = $soldQuery->sum('quantity');

        // Total Active Products (In Stock) - Snapshot, not time based
        $activeProducts = Product::where('in_stock', true)->count();

        // Best Selling Product Name (Global or Period? Let's do Period)
        $bestSelling = $soldQuery->select('product_id', DB::raw('sum(quantity) as val'))
            ->groupBy('product_id')
            ->orderByDesc('val')
            ->with('product') // Eager load? OrderItem belongsTo Product (usually 'product')
            ->first();
        
        $bestProductName = $bestSelling ? ($bestSelling->product->name ?? 'Unknown') : 'None';

        return [
            Stat::make('Total Units Sold', $totalUnitsSold)
                ->description('Volume in period')
                ->color('primary'),
            Stat::make('Active Products', $activeProducts)
                ->description('Currently in stock')
                ->color('success'),
            Stat::make('Best Selling Product', $bestProductName)
                ->description('Highest volume')
                ->color('warning'),
        ];
    }
}
