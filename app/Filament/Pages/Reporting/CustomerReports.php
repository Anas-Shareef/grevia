<?php

namespace App\Filament\Pages\Reporting;

use Filament\Pages\Page;
use Filament\Support\Enums\Width;
use UnitEnum;
use BackedEnum;

class CustomerReports extends Page
{
    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-users';

    protected static string | UnitEnum | null $navigationGroup = 'Reporting';

    protected static ?string $navigationLabel = 'Customers';

    protected static ?string $title = 'Customer Overview';

    protected static ?int $navigationSort = 2;

    protected static ?string $slug = 'reporting/customers';

    protected string $view = 'filament.pages.reporting.customers';

    public function getMaxContentWidth(): Width | string | null
    {
        return Width::Full;
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\Reporting\DateFilterWidget::class,
            \App\Filament\Widgets\Reporting\CustomerStatsWidget::class,
            \App\Filament\Widgets\Reporting\CustomerGrowthChartWidget::class,
            \App\Filament\Widgets\Reporting\TopCustomersTableWidget::class,
        ];
    }
}
