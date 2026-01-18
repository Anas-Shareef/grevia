<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Widgets\ChartWidget;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CustomerGrowthChartWidget extends ChartWidget
{
    protected ?string $heading = 'New Customer Growth'; // Fixed: Removed static

    protected function getData(): array
    {
        $range = request()->query('date_range', '30d');
        $startDate = request()->query('start_date');
        $endDate = request()->query('end_date');

        $query = User::query()->where('email', 'not like', '%@grevia.com%');
        
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

        $data = $query->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as aggregate'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'New Customers',
                    'data' => $data->pluck('aggregate'),
                    'borderColor' => '#3B82F6', // Blue
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
