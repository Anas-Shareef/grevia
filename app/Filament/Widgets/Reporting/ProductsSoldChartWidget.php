<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Widgets\ChartWidget;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductsSoldChartWidget extends ChartWidget
{
    protected ?string $heading = 'Units Sold Over Time'; // Fixed: Removed static

    protected function getData(): array
    {
        $range = request()->query('date_range', '30d');
        $startDate = request()->query('start_date');
        $endDate = request()->query('end_date');

        $query = OrderItem::query();
        
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

        $data = $query->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(quantity) as aggregate'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Units Sold',
                    'data' => $data->pluck('aggregate'),
                    'backgroundColor' => '#F59E0B', // Amber
                    'borderColor' => '#F59E0B',
                ],
            ],
            'labels' => $data->pluck('date'),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
