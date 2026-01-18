<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Order;
use Carbon\Carbon;

class SalesStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $range = request()->query('date_range', '30d');
        $startDate = request()->query('start_date');
        $endDate = request()->query('end_date');

        $query = Order::query();

        if ($range === 'today') {
            $query->whereDate('created_at', Carbon::today());
        } elseif ($range === '7d') {
            $query->where('created_at', '>=', Carbon::now()->subDays(7));
        } elseif ($range === '30d') {
            $query->where('created_at', '>=', Carbon::now()->subDays(30));
        } elseif ($range === 'month') {
            $query->whereMonth('created_at', Carbon::now()->month)
                  ->whereYear('created_at', Carbon::now()->year);
        } elseif ($range === 'custom' && $startDate && $endDate) {
            $query->whereBetween('created_at', [Carbon::parse($startDate), Carbon::parse($endDate)]);
        }

        // Clone query for efficiency if real DB
        $totalSales = (clone $query)->sum('total'); // 'total' column verified
        $totalOrders = (clone $query)->count();
        $avgOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;
        $completedOrders = (clone $query)->where('status', 'completed')->count(); // Assuming 'status' column

        return [
            Stat::make('Total Sales', '₹' . number_format($totalSales, 2))
                ->description('Gross sales in period')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('Total Orders', $totalOrders)
                ->description('All orders received')
                ->color('primary'),
            Stat::make('Average Order Value', '₹' . number_format($avgOrderValue, 2))
                ->description('Per order average')
                ->color('warning'),
            Stat::make('Completed Orders', $completedOrders)
                ->description('Successfully delivered')
                ->color('success'),
        ];
    }
}
