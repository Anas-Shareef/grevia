<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Widgets\Widget;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema; // Changed form Form to Schema
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Utilities\Get;

class DateFilterWidget extends Widget implements HasForms
{
    use InteractsWithForms;

    protected int | string | array $columnSpan = 'full';

    protected string $view = 'filament.widgets.reporting.date-filter-widget';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'date_range' => request()->query('date_range', '30d'),
            'start_date' => request()->query('start_date'),
            'end_date' => request()->query('end_date'),
        ]);
    }   

    // Changed Form type hint to Schema
    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Grid::make(4)
                    ->components([
                        Select::make('date_range')
                            ->label('Date Range')
                            ->options([
                                'today' => 'Today',
                                '7d' => 'Last 7 Days',
                                '30d' => 'Last 30 Days',
                                'month' => 'This Month',
                                'custom' => 'Custom Range',
                            ])
                            ->live()
                            ->afterStateUpdated(fn ($state) => $this->updateFilter()),
                        
                        DatePicker::make('start_date')
                            ->label('Start Date')
                            ->visible(fn (Get $get) => $get('date_range') === 'custom')
                            ->live()
                            ->afterStateUpdated(fn () => $this->updateFilter()),

                        DatePicker::make('end_date')
                            ->label('End Date')
                            ->visible(fn (Get $get) => $get('date_range') === 'custom')
                            ->live()
                            ->afterStateUpdated(fn () => $this->updateFilter()),
                    ]),
            ])
            ->statePath('data');
    }

    public function updateFilter(): void
    {
        $data = $this->form->getState();
        $referer = request()->header('Referer');
        $baseUrl = explode('?', $referer)[0];

        $this->redirect($baseUrl . '?' . http_build_query([
            'date_range' => $data['date_range'],
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
        ]));
    }
}
