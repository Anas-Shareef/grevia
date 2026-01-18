<?php

namespace App\Filament\Widgets;

use App\Models\OrderItem;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class BestSellersChart extends ChartWidget
{
    protected ?string $heading = 'Best Sellers';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $topProducts = OrderItem::query()
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.name as product_name', DB::raw('sum(order_items.quantity) as total_qty'))
            ->groupBy('products.name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Units Sold',
                    'data' => $topProducts->pluck('total_qty')->toArray(),
                    'backgroundColor' => '#36A2EB',
                    'borderColor' => '#36A2EB',
                ],
            ],
            'labels' => $topProducts->pluck('product_name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
