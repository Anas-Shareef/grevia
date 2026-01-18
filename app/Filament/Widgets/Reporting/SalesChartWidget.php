<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Widgets\ChartWidget;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SalesChartWidget extends ChartWidget
{
    protected ?string $heading = 'Sales Over Time'; // Fixed: Removed static

    protected function getData(): array
    {
        $range = request()->query('date_range', '30d');
        $startDate = request()->query('start_date');
        $endDate = request()->query('end_date');

        $query = Order::query();
        // Simple day grouping
        $dateFormat = 'Y-m-d';
        
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

        // Aggregate by date
        // Note: For 'Today', this might be just one point. Ideally 'Hour'? Keeping it simple for demo.
        // SQLite/MySQL compatibility: DB::raw('DATE(created_at)') is standard enough.
        $data = $query->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as aggregate'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Revenue',
                    'data' => $data->pluck('aggregate'),
                    'borderColor' => '#10B981', // Lime/Green shade
                ],
            ],
            'labels' => $data->pluck('date'),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
