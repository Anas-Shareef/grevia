<?php

namespace App\Filament\Resources\Orders\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class OrderStats extends BaseWidget
{
    protected function getStats(): array
    {
        $thirtyDaysAgo = now()->subDays(30);
        
        $revenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->sum('total');
            
        $pendingCount = Order::where('status', 'pending')->count();
        
        $avgValue = Order::where('created_at', '>=', $thirtyDaysAgo)->avg('total') ?? 0;

        return [
            Stat::make('Revenue (30d)', '₹' . number_format($revenue, 2))
                ->description('Paid orders in last 30 days')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
            
            Stat::make('Pending Orders', $pendingCount)
                ->description('Requires your attention')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingCount > 0 ? 'warning' : 'gray'),

            Stat::make('Avg Order Value', '₹' . number_format($avgValue, 2))
                ->description('Average ticket size')
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('info'),
        ];
    }
}
