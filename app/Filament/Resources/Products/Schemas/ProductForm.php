<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Product;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('General Information')
                    ->columns(2)
                    ->components([
                        TextInput::make('name')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, $set) => $set('slug', str($state)->slug())),
                        TextInput::make('slug')
                            ->required()
                            ->unique(Product::class, 'slug', ignoreRecord: true),
                        Select::make('category_id')
                            ->relationship('category', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        TextInput::make('subcategory')
                            ->placeholder('e.g. stevia, monkfruit'),
                        Textarea::make('description')
                            ->columnSpanFull()
                            ->required(),
                        RichEditor::make('long_description')
                            ->columnSpanFull(),
                        TagsInput::make('ingredients')
                            ->placeholder('Add ingredient')
                            ->helperText('Press enter after each ingredient')
                            ->columnSpanFull(),
                        TagsInput::make('tags')
                            ->placeholder('Add tag')
                            ->helperText('Product tags for searching/filtering')
                            ->columnSpanFull(),
                    ]),
                Section::make('Pricing & Inventory (Default)')
                    ->description('These values serve as defaults if no variants are specified.')
                    ->columns(3)
                    ->components([
                        TextInput::make('price')
                            ->numeric()
                            ->prefix('₹')
                            ->live(onBlur: true),
                        TextInput::make('original_price')
                            ->numeric()
                            ->prefix('₹'),
                        TextInput::make('badge')
                            ->placeholder('e.g. Best Seller, New')
                            ->live(onBlur: true),
                        Toggle::make('in_stock')
                            ->default(true),
                        Toggle::make('is_featured')
                            ->label('Featured Product')
                            ->helperText('Show this product on the homepage')
                            ->default(false),
                    ]),
                Section::make('Global Media (Fallback)')
                    ->description('Fallback image shown only if the product has no gallery photos.')
                    ->collapsed()
                    ->components([
                        FileUpload::make('image')
                            ->label('Fallback Image')
                            ->helperText('This image is only shown when the Product Gallery is empty.')
                            ->image()
                            ->disk('public')
                            ->directory('products')
                            ->imagePreviewHeight('200')
                            ->columnSpanFull(),
                    ]),
                Section::make('Product Gallery')
                    ->description('Manage main and additional photos for this product.')
                    ->components([
                        Placeholder::make('image_warning')
                            ->label('')
                            ->content(function ($record) {
                                if ($record && empty($record->image_url)) {
                                    return new \Illuminate\Support\HtmlString('<div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px; color: #92400E; border-radius: 4px; font-weight: 500;">⚠️ No images uploaded — storefront will show a placeholder.</div>');
                                }
                                return '';
                            })
                            ->hidden(fn ($record) => !$record || !empty($record->image_url))
                            ->columnSpanFull(),
                        Repeater::make('gallery')
                            ->relationship('gallery')
                            ->schema([
                                FileUpload::make('image_path')
                                    ->label('Photo')
                                    ->image()
                                    ->disk('public')
                                    ->directory('products/gallery')
                                    ->required()
                                    ->columnSpanFull(),
                                Toggle::make('is_main')
                                    ->label('Main Photo')
                                    ->helperText('This photo will be the primary one shown on the store.')
                                    ->default(false)
                                    ->inline(false),
                                TextInput::make('sort_order')
                                    ->numeric()
                                    ->default(0)
                                    ->label('Display Order'),
                            ])
                            ->columns(2)
                            ->addActionLabel('Add Gallery Photo')
                            ->defaultItems(0)
                            ->collapsible()
                            ->itemLabel(fn (array $state): string => $state['is_main'] ? '⭐ Main Photo' : 'Gallery Photo')
                            ->columnSpanFull(),
                    ]),
                Section::make('Product Variants')
                    ->description('Manage weight/pack variants for this product. If variants exist, they will override the base price/stock on the frontend.')
                    ->components([
                        Repeater::make('variants')
                            ->relationship()
                            ->schema([
                                TextInput::make('weight')
                                    ->placeholder('e.g. 100g, 250g, 1kg')
                                    ->required()
                                    ->helperText('This value automatically appears as a Pack Size filter option on the collections page. Always use a number followed immediately by the unit: 50g, 250g, 1kg, 30ml. No spaces between number and unit. If left blank, this variant will NOT appear in the Pack Size filter.'),
                                TextInput::make('pack_size')
                                    ->label('Pack Size')
                                    ->numeric()
                                    ->default(1)
                                    ->required(),
                                TextInput::make('price')
                                    ->numeric()
                                    ->prefix('₹')
                                    ->required(),
                                TextInput::make('discount_price')
                                    ->numeric()
                                    ->prefix('₹')
                                    ->label('Discount Price'),
                                TextInput::make('stock_quantity')
                                    ->numeric()
                                    ->default(10)
                                    ->required(),
                                TextInput::make('sku')
                                    ->label('SKU')
                                    ->required()
                                    ->helperText('A unique SKU will be generated if left blank, but it is recommended to provide one.')
                                    ->default(fn () => 'VAR-' . strtoupper(uniqid()))
                                    ->unique(\App\Models\ProductVariant::class, 'sku', ignoreRecord: true),
                                Select::make('status')
                                    ->options([
                                        'active' => 'Active',
                                        'inactive' => 'Inactive',
                                    ])
                                    ->default('active')
                                    ->required(),
                                Repeater::make('variantImages')
                                    ->relationship('variantImages')
                                    ->schema([
                                        FileUpload::make('image_path')
                                            ->label('Photo')
                                            ->image()
                                            ->disk('public')
                                            ->directory('variants')
                                            ->required()
                                            ->columnSpanFull(),
                                        Toggle::make('is_main')
                                            ->label('Main Photo')
                                            ->helperText('The main photo is shown as the big image when this variant is selected.')
                                            ->default(false)
                                            ->inline(false),
                                        TextInput::make('sort_order')
                                            ->numeric()
                                            ->default(0)
                                            ->label('Order'),
                                    ])
                                    ->columns(2)
                                    ->addActionLabel('Add Photo')
                                    ->defaultItems(0)
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): string => $state['is_main'] ? '⭐ Main Photo' : 'Photo')
                                    ->columnSpanFull()
                                    ->hidden(fn () => !\Illuminate\Support\Facades\Schema::hasTable('variant_images')),
                            ])
                            ->columns(3)
                            ->itemLabel(fn (array $state): ?string => ($state['weight'] ?? '') . ' - Pack of ' . ($state['pack_size'] ?? '1'))
                            ->collapsible(),
                    ]),
                Section::make('🔍 Search & Filter Attributes')
                    ->description('These fields directly power the sidebar filters on the Collections page. Fill these accurately to ensure products appear when customers use filters.')
                    ->icon('heroicon-o-funnel')
                    ->collapsible()
                    ->columns(3)
                    ->components([
                        TextInput::make('format')
                            ->label('Format / Product Type')
                            ->placeholder('e.g. powder, drops, liquid')
                            ->helperText('Type any format. This powers the "Format" filter on the storefront.')
                            ->required()
                            ->afterStateHydrated(fn ($component, $state, $record) => $state ? null : $component->state($record?->form))
                            ->dehydrateStateUsing(function ($state, $record) {
                                if ($record) { $record->form = $state; }
                                return $state;
                            }),

                        TextInput::make('concentration')
                            ->label('Concentration / Potency')
                            ->placeholder('e.g. 1:10, 1:50, 1:200')
                            ->helperText('Type any ratio. This powers the "Concentration" filter on the storefront.')
                            ->afterStateHydrated(fn ($component, $state, $record) => $state ? null : $component->state($record?->ratio))
                            ->dehydrateStateUsing(function ($state, $record) {
                                if ($record) { $record->ratio = $state; }
                                return $state;
                            }),

                        TagsInput::make('size_label')
                            ->label('Pack Size Tags')
                            ->helperText('Type a size (e.g. 50g, 100g) and press enter. This powers the storefront Pack Size filters.')
                            ->placeholder('e.g. 50g')
                            ->separator(',')
                            ->afterStateHydrated(function ($component, $state) {
                                if (is_string($state) && !empty($state)) {
                                    $component->state(array_map('trim', explode(',', $state)));
                                }
                            })
                            ->dehydrateStateUsing(fn ($state) => is_array($state) ? implode(',', $state) : $state),

                        TextInput::make('type')
                            ->label('Sweetener Type')
                            ->placeholder('e.g. stevia, monk-fruit')
                            ->helperText('Internal type identifier.'),

                        TextInput::make('sweetness_description')
                            ->label('Sweetness Description')
                            ->placeholder('e.g. 1g replaces 10g of sugar')
                            ->columnSpan(2),

                        TextInput::make('use_case')
                            ->label('Ideal Use Cases')
                            ->placeholder('e.g. tea, coffee, smoothies, baking')
                            ->columnSpan(3),

                        RichEditor::make('usage_instructions')
                            ->label('Usage Instructions')
                            ->placeholder('Step by step guide on how to use this product...')
                            ->visible(fn () => \Illuminate\Support\Facades\Schema::hasColumn('products', 'usage_instructions'))
                            ->columnSpanFull(),

                        RichEditor::make('nutrition_facts')
                            ->label('Nutrition Facts')
                            ->placeholder('Nutrition details, vitamins, etc...')
                            ->visible(fn () => \Illuminate\Support\Facades\Schema::hasColumn('products', 'nutrition_facts'))
                            ->columnSpanFull(),

                        Select::make('related_products')
                            ->label('Cross-Sell Picker (You May Also Like)')
                            ->multiple()
                            ->options(\App\Models\Product::query()->pluck('name', 'slug')->toArray())
                            ->afterStateHydrated(function ($component, $state) {
                                if (is_string($state) && !empty($state)) {
                                    $component->state(array_map('trim', explode(',', $state)));
                                }
                            })
                            ->dehydrateStateUsing(fn ($state) => is_array($state) ? implode(',', $state) : $state)
                            ->helperText('Manually choose which products appear in the "You May Also Like" section.')
                            ->columnSpanFull(),

                        Grid::make(2)
                            ->schema([
                                TextInput::make('rating')
                                    ->numeric()
                                    ->step(0.1)
                                    ->readOnly()
                                    ->helperText('Auto-managed by customer reviews.'),
                                TextInput::make('reviews')
                                    ->label('Reviews Count')
                                    ->numeric()
                                    ->readOnly()
                                    ->helperText('Auto-managed by customer reviews.'),
                            ]),
                    ]),
                Section::make('Live Preview & Tools')
                    ->collapsed()
                    ->components([
                        Placeholder::make('preview_card')
                            ->label('Store View')
                            ->content(fn ($get, $record) => view('filament.products.preview-card', [
                                'getState' => fn () => [
                                    'name' => $get('name'),
                                    'price' => $get('price'),
                                    'badge' => $get('badge'),
                                ],
                                'getRecord' => fn () => $record ?? $schema->getModelInstance(),
                            ])),
                        Placeholder::make('meta_info')
                            ->label('Metadata')
                            ->content(fn ($record) => $record ? "Created: " . $record?->created_at?->format('M d, Y') : "New Product"),
                    ]),
            ]);
    }
}
