<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Refund;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        // Disable live queries to debug admin crash
        return [
            Stat::make('Total Sales', '₹0.00'),
            Stat::make('Total Orders', '0'),
            Stat::make('Refund Rate', '0%'),
        ];
        /*
        $totalSales = Order::where('status', 'completed')->sum('total');
        $totalOrders = Order::count();
        $refundedAmount = Refund::where('status', 'processed')->sum('amount');
        
        // Calculate refund rate safely
        $refundRate = $totalSales > 0 ? (($refundedAmount / $totalSales) * 100) : 0;

        return [
            Stat::make('Total Sales', '₹' . number_format($totalSales, 2))
                ->description('Total completed orders')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            
            Stat::make('Total Orders', $totalOrders)
                ->description('All orders placed')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),

            Stat::make('Refund Rate', number_format($refundRate, 1) . '%')
                ->description('Refunds / Sales')
                ->descriptionIcon('heroicon-m-arrow-path')
                ->color($refundRate > 10 ? 'danger' : 'success'),
        ];
        */
    }
}
