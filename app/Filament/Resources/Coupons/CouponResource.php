<?php

namespace App\Filament\Resources\Coupons;

use App\Filament\Resources\Coupons\Pages\CreateCoupon;
use App\Filament\Resources\Coupons\Pages\EditCoupon;
use App\Filament\Resources\Coupons\Pages\ListCoupons;
use App\Models\Coupon;
use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class CouponResource extends Resource
{
    protected static ?string $model = Coupon::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    protected static string|\UnitEnum|null $navigationGroup = 'Marketing';

    protected static ?string $navigationLabel = 'Coupons & Promos';

    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form->schema([
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
                        ->maxValue(fn (Forms\Get $get): int => $get('type') === 'percentage' ? 100 : 999999)
                        ->placeholder(fn (Forms\Get $get): string => $get('type') === 'percentage' ? 'e.g. 10 for 10% off' : 'e.g. 50 for ₹50 off')
                        ->suffix(fn (Forms\Get $get): string => $get('type') === 'percentage' ? '%' : '₹'),

                    TextInput::make('min_order_value')
                        ->label('Minimum Order Value (₹)')
                        ->numeric()
                        ->default(0)
                        ->minValue(0)
                        ->placeholder('0 = no minimum')
                        ->helperText('Cart subtotal must be at least this amount to use the coupon.')
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
                        ->helperText('Maximum number of times this coupon can be used. Blank = unlimited.'),

                    DateTimePicker::make('expiry_date')
                        ->label('Expiry Date & Time')
                        ->nullable()
                        ->placeholder('Leave blank for no expiry')
                        ->helperText('Coupon will become invalid after this date/time.')
                        ->minDate(now()),
                ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->label('Code')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->copyMessage('Coupon code copied!')
                    ->badge()
                    ->color('success')
                    ->weight(\Filament\Support\Enums\FontWeight::Bold),

                TextColumn::make('type')
                    ->label('Type')
                    ->formatStateUsing(fn ($state) => $state === 'percentage' ? 'Percentage' : 'Fixed Amount')
                    ->badge()
                    ->color(fn ($state) => $state === 'percentage' ? 'warning' : 'info'),

                TextColumn::make('value')
                    ->label('Discount')
                    ->formatStateUsing(fn ($state, $record) =>
                        $record->type === 'percentage'
                            ? $state . '%'
                            : '₹' . number_format($state, 0)
                    )
                    ->sortable(),

                TextColumn::make('min_order_value')
                    ->label('Min. Order')
                    ->formatStateUsing(fn ($state) => $state > 0 ? '₹' . number_format($state, 0) : '—')
                    ->sortable(),

                TextColumn::make('usage')
                    ->label('Usage')
                    ->getStateUsing(fn ($record) =>
                        $record->usage_count . ' / ' . ($record->usage_limit ?? '∞')
                    )
                    ->color(fn ($record) =>
                        $record->usage_limit && $record->usage_count >= $record->usage_limit
                            ? 'danger' : 'gray'
                    ),

                TextColumn::make('expiry_date')
                    ->label('Expires')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->placeholder('Never')
                    ->color(fn ($record) =>
                        $record->expiry_date && now()->isAfter($record->expiry_date) ? 'danger' : 'gray'
                    ),

                IconColumn::make('status')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
            ])
            ->filters([
                TernaryFilter::make('status')
                    ->label('Status')
                    ->placeholder('All Coupons')
                    ->trueLabel('Active Only')
                    ->falseLabel('Inactive Only'),

                SelectFilter::make('type')
                    ->label('Type')
                    ->options([
                        'fixed'      => 'Fixed Amount',
                        'percentage' => 'Percentage',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->emptyStateHeading('No coupons yet')
            ->emptyStateDescription('Create your first coupon to start offering discounts to customers.')
            ->emptyStateIcon('heroicon-o-tag');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListCoupons::route('/'),
            'create' => CreateCoupon::route('/create'),
            'edit'   => EditCoupon::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::where('status', true)->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }
}
