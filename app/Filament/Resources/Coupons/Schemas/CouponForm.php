<?php

namespace App\Filament\Resources\Coupons\Schemas;

use App\Models\Coupon;
use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CouponForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Coupon Details')
                ->description('Set up the coupon code and discount configuration.')
                ->icon('heroicon-o-ticket')
                ->schema([
                    TextInput::make('code')
                        ->label('Coupon Code')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->placeholder('e.g. SAVE10, GREVIA20')
                        ->helperText('Will be auto-uppercased. Share this code with customers.')
                        ->afterStateUpdated(fn ($state, callable $set) => $set('code', strtoupper($state)))
                        ->live(onBlur: true)
                        ->columnSpan(1),

                    Toggle::make('status')
                        ->label('Active')
                        ->helperText('Inactive coupons cannot be redeemed.')
                        ->default(true)
                        ->columnSpan(1),
                ])->columns(2),

            Section::make('Discount Configuration')
                ->icon('heroicon-o-currency-rupee')
                ->schema([
                    Select::make('type')
                        ->label('Discount Type')
                        ->options([
                            'fixed'      => 'Fixed Amount (₹)',
                            'percentage' => 'Percentage (%)',
                        ])
                        ->required()
                        ->default('fixed')
                        ->live(),

                    TextInput::make('value')
                        ->label(fn (Forms\Get $get): string => $get('type') === 'percentage' ? 'Discount (%)' : 'Discount Amount (₹)')
                        ->required()
                        ->numeric()
                        ->minValue(0.01)
                        ->placeholder(fn (Forms\Get $get): string => $get('type') === 'percentage' ? 'e.g. 10 for 10% off' : 'e.g. 50 for ₹50 off')
                        ->suffix(fn (Forms\Get $get): string => $get('type') === 'percentage' ? '%' : '₹'),

                    TextInput::make('min_order_value')
                        ->label('Minimum Order Value (₹)')
                        ->numeric()
                        ->default(0)
                        ->minValue(0)
                        ->placeholder('0 = no minimum')
                        ->helperText('Cart subtotal must be at least this amount.')
                        ->prefix('₹'),
                ])->columns(3),

            Section::make('Usage & Validity')
                ->icon('heroicon-o-clock')
                ->schema([
                    TextInput::make('usage_limit')
                        ->label('Usage Limit')
                        ->numeric()
                        ->nullable()
                        ->placeholder('Leave blank for unlimited')
                        ->helperText('Maximum number of times this coupon can be used.'),

                    DateTimePicker::make('expiry_date')
                        ->label('Expiry Date & Time')
                        ->nullable()
                        ->placeholder('Leave blank for no expiry')
                        ->helperText('Coupon will become invalid after this date/time.')
                        ->minDate(now()),
                ])->columns(2),
        ]);
    }
}
