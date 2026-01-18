<?php

namespace App\Filament\Widgets\Reporting;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class TopCustomersTableWidget extends BaseWidget
{
    protected static ?string $heading = 'Top Spending Customers';
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()
                    ->select(DB::raw('user_id as id'), 'user_id', DB::raw('count(*) as total_orders'), DB::raw('sum(total) as total_spent'))
                    ->whereNotNull('user_id')
                    ->whereHas('user', fn ($q) => $q->where('email', 'not like', '%@grevia.com%'))
                    ->groupBy('user_id')
                    ->orderByDesc('total_spent')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer Name'),
                Tables\Columns\TextColumn::make('total_orders')
                    ->label('Total Orders'),
                Tables\Columns\TextColumn::make('total_spent')
                    ->label('Total Spend')
                    ->money('INR'),
            ])
            ->paginated(false);
    }
}
