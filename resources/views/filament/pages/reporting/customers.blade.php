<x-filament-panels::page>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {{-- Full Width Filter --}}
        <div class="md:col-span-2">
            @livewire(\App\Filament\Widgets\Reporting\DateFilterWidget::class)
        </div>
        
        {{-- Full Width Stats --}}
        <div class="md:col-span-2">
            @livewire(\App\Filament\Widgets\Reporting\CustomerStatsWidget::class)
        </div>

        {{-- Chart and Table --}}
        <div class="md:col-span-1">
            @livewire(\App\Filament\Widgets\Reporting\CustomerGrowthChartWidget::class)
        </div>
        <div class="md:col-span-1">
             @livewire(\App\Filament\Widgets\Reporting\TopCustomersTableWidget::class)
        </div>
    </div>
</x-filament-panels::page>
