<?php

namespace App\Filament\Pages\Reporting;

use Filament\Pages\Page;
use Filament\Support\Enums\Width;
use UnitEnum;
use BackedEnum;

class SalesReports extends Page
{
    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-currency-dollar';

    protected static string | UnitEnum | null $navigationGroup = 'Reporting';

    protected static ?string $navigationLabel = 'Sales';

    protected static ?string $title = 'Sales Overview';

    protected static ?int $navigationSort = 1;

    protected static ?string $slug = 'reporting/sales';

    protected string $view = 'filament.pages.reporting.sales';

    public function getMaxContentWidth(): Width | string | null
    {
        return Width::Full;
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\Reporting\DateFilterWidget::class,
            \App\Filament\Widgets\Reporting\SalesStatsWidget::class,
            \App\Filament\Widgets\Reporting\SalesChartWidget::class,
            \App\Filament\Widgets\Reporting\TopProductsTableWidget::class,
        ];
    }
}
