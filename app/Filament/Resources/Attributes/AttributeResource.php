<?php

namespace App\Filament\Resources\Attributes;

use App\Filament\Resources\Attributes\Pages;
use App\Models\Attribute;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Get;

class AttributeResource extends Resource
{
    protected static ?string $model = Attribute::class;

    protected static string|\UnitEnum|null $navigationGroup = 'Catalog';



    protected static ?string $navigationLabel = 'Attributes';

    protected static ?int $navigationSort = 3;

    public static function shouldRegisterNavigation(): bool
    {
        return \Illuminate\Support\Facades\Schema::hasTable('attributes');
    }

    public static function canViewAny(): bool
    {
        return \Illuminate\Support\Facades\Schema::hasTable('attributes');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Attribute Configuration')
                    ->columns(2)
                    ->components([
                        TextInput::make('name')
                            ->label('Internal Name (slug-style)')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('e.g. format, concentration, trust_badges — lowercase, no spaces')
                            ->live(onBlur: true),

                        TextInput::make('label')
                            ->label('Display Label')
                            ->required()
                            ->helperText('e.g. Format, Concentration / Potency'),

                        Select::make('display_type')
                            ->label('Display Type')
                            ->options([
                                'text_label' => 'Text Label — plain text on PDP',
                                'bubble_pill' => 'Bubble Pill — interactive pill selector (Concentration)',
                                'icon_text'   => 'Icon + Text — badge with icon (Trust Badges)',
                            ])
                            ->default('text_label')
                            ->required()
                            ->live(),

                        Select::make('filter_type')
                            ->label('Sidebar Filter Type')
                            ->options([
                                'single_select' => 'Single Select (radio)',
                                'multi_select'  => 'Multi Select (checkbox)',
                                'not_filtered'  => 'Not in Filter',
                            ])
                            ->default('single_select')
                            ->required(),

                        TextInput::make('sort_order')
                            ->label('Sort Order (sidebar position)')
                            ->numeric()
                            ->default(0),

                        Toggle::make('is_required')
                            ->label('Required on Product?')
                            ->helperText('Block publish if no value assigned')
                            ->default(false),
                    ]),

                Section::make('Attribute Values')
                    ->components([
                        Repeater::make('values')
                            ->relationship('values')
                            ->schema([
                                TextInput::make('value_text')
                                    ->label('Display Label')
                                    ->required()
                                    ->helperText('e.g. "1:10 (High Potency)", "Keto Friendly"')
                                    ->columnSpan(1),

                                TextInput::make('slug')
                                    ->label('Slug (URL-safe)')
                                    ->required()
                                    ->helperText('e.g. "1-10", "keto-friendly"')
                                    ->columnSpan(1),

                                // Only shown for bubble_pill (Concentration)
                                Textarea::make('meta.substitution_text')
                                    ->label('Substitution Text')
                                    ->helperText('e.g. "1g replaces 10g of sugar" — shown in PDP info box')
                                    ->rows(2)
                                    ->columnSpan(2)
                                    ->visible(fn ($get): bool =>
                                        $get('../../display_type') === 'bubble_pill'
                                    ),

                                Toggle::make('meta.is_default')
                                    ->label('Set as PDP Default?')
                                    ->helperText('Pre-selects this pill when customers view the product page')
                                    ->columnSpan(2)
                                    ->visible(fn ($get): bool =>
                                        $get('../../display_type') === 'bubble_pill'
                                    ),

                                // Only shown for icon_text (Trust Badges)
                                FileUpload::make('icon_url')
                                    ->label('Icon (SVG or PNG, max 50KB)')
                                    ->image()
                                    ->disk('public')
                                    ->directory('attributes/icons')
                                    ->maxSize(50)
                                    ->helperText('32×32px recommended. Shown on PDP and Quick Shop.')
                                    ->columnSpan(2)
                                    ->visible(fn ($get): bool =>
                                        $get('../../display_type') === 'icon_text'
                                    ),

                                TextInput::make('sort_order')
                                    ->label('Order')
                                    ->numeric()
                                    ->default(0)
                                    ->columnSpan(1),
                            ])
                            ->columns(2)
                            ->addActionLabel('+ Add Value')
                            ->defaultItems(0)
                            ->reorderable('sort_order')
                            ->collapsible()
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->sortable()
                    ->searchable()
                    ->copyable(),

                TextColumn::make('label')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('display_type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'bubble_pill' => 'info',
                        'icon_text'   => 'warning',
                        default       => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'text_label'  => 'Text Label',
                        'bubble_pill' => 'Bubble Pill',
                        'icon_text'   => 'Icon + Text',
                        default       => $state,
                    }),

                TextColumn::make('filter_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'single_select' => 'Single Select',
                        'multi_select'  => 'Multi Select',
                        'not_filtered'  => 'Not Filtered',
                        default         => $state,
                    }),

                TextColumn::make('values_count')
                    ->label('# Values')
                    ->counts('values'),
            ])
            ->defaultSort('sort_order')
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make()
                    ->before(function ($record, $action) {
                        if (!\Illuminate\Support\Facades\Schema::hasTable('product_attribute_value')) return;
                        $usageCount = \DB::table('product_attribute_value')
                            ->whereIn('value_id', $record->values->pluck('id'))
                            ->count();
                        if ($usageCount > 0) {
                            \Filament\Notifications\Notification::make()
                                ->title('Cannot Delete Attribute')
                                ->body("This attribute is assigned to {$usageCount} products. Unassign it first.")
                                ->danger()
                                ->send();
                            $action->cancel();
                        }
                    })
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListAttributes::route('/'),
            'create' => Pages\CreateAttribute::route('/create'),
            'edit'   => Pages\EditAttribute::route('/{record}/edit'),
        ];
    }
}
