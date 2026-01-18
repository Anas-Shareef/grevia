<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\User;
use App\Models\Order;
use Carbon\Carbon;

class CustomerStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $range = request()->query('date_range', '30d');
        $startDate = request()->query('start_date');
        $endDate = request()->query('end_date');

        // Total Customers (All time usually, or filtered? Usually Total is stat, New is filtered)
        $totalCustomers = User::where('email', 'not like', '%@grevia.com%')->count();

        // New Customers Queries
        $newQuery = User::query()->where('email', 'not like', '%@grevia.com%');
        if ($range === 'today') {
            $newQuery->whereDate('created_at', Carbon::today());
        } elseif ($range === '7d') {
            $newQuery->where('created_at', '>=', Carbon::now()->subDays(7));
        } elseif ($range === '30d') {
            $newQuery->where('created_at', '>=', Carbon::now()->subDays(30));
        } elseif ($range === 'month') {
            $newQuery->whereMonth('created_at', Carbon::now()->month)
                     ->whereYear('created_at', Carbon::now()->year);
        } elseif ($range === 'custom' && $startDate && $endDate) {
            $newQuery->whereBetween('created_at', [Carbon::parse($startDate), Carbon::parse($endDate)]);
        }
        $newCustomers = $newQuery->count();

        // Avg Spend per Customer (Total Sales / Total Customers with orders)
        // This is a global metric usually, but maybe filtered by sales in period / active customers in period?
        // Let's keep it simple: Global Avg Spend.
        $totalRevenue = Order::sum('total');
        $customersWithOrders = Order::distinct('user_id')->count('user_id');
        $avgSpend = $customersWithOrders > 0 ? $totalRevenue / $customersWithOrders : 0;

        return [
            Stat::make('Total Customers', $totalCustomers)
                ->description('Registered accounts')
                ->color('primary'),
            Stat::make('New Customers', $newCustomers)
                ->description('Joined in this period')
                ->color('success'),
            Stat::make('Avg Spend per Customer', '₹' . number_format($avgSpend, 2))
                ->description('Lifetime value')
                ->color('warning'),
        ];
    }
}
