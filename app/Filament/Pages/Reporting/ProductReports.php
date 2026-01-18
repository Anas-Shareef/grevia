<?php

namespace App\Filament\Pages\Reporting;

use Filament\Pages\Page;
use Filament\Support\Enums\Width;
use UnitEnum;
use BackedEnum;

class ProductReports extends Page
{
    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-shopping-bag';

    protected static string | UnitEnum | null $navigationGroup = 'Reporting';

    protected static ?string $navigationLabel = 'Products';

    protected static ?string $title = 'Product Overview';

    protected static ?int $navigationSort = 3;

    protected static ?string $slug = 'reporting/products';

    protected string $view = 'filament.pages.reporting.products';

    public function getMaxContentWidth(): Width | string | null
    {
        return Width::Full;
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\Reporting\DateFilterWidget::class,
            \App\Filament\Widgets\Reporting\ProductStatsWidget::class,
            \App\Filament\Widgets\Reporting\ProductsSoldChartWidget::class,
            \App\Filament\Widgets\Reporting\LowPerformingProductsTableWidget::class,
        ];
    }
}
