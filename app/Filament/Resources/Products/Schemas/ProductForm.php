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
                Section::make('🛒 PDP Content & Attributes')
                    ->description('Detailed content for the Product Detail Page accordions and trust signals.')
                    ->collapsible()
                    ->components([
                        RichEditor::make('product_description')
                            ->label('Story / Detailed Description')
                            ->helperText('Accordion 1: The premium story of the product.')
                            ->columnSpanFull(),
                        
                        RichEditor::make('ingredients')
                            ->label('Ingredients List')
                            ->helperText('Accordion 2: Detailed list of ingredients.')
                            ->columnSpanFull(),
                            
                        RichEditor::make('usage_instructions')
                            ->label('How to Use')
                            ->helperText('Accordion 3: Step-by-step instructions.')
                            ->columnSpanFull(),

                        Grid::make(2)
                            ->schema([
                                TagsInput::make('concentration_options')
                                    ->label('Available Concentrations')
                                    ->placeholder('e.g. 1:10, 1:50')
                                    ->helperText('Type a ratio and press enter. These become selectable pills on the PDP.')
                                    ->separator(','),
                                Select::make('concentration')
                                    ->label('Default Concentration')
                                    ->options(fn ($get) => array_combine($get('concentration_options') ?? [], $get('concentration_options') ?? []))
                                    ->helperText('Pre-selected concentration pill on page load.'),
                            ]),

                        TagsInput::make('health_benefits')
                            ->label('Health Benefit Chips')
                            ->placeholder('e.g. Keto-Friendly, Zero-Glycemic')
                            ->helperText('Type a benefit and press enter. Renders as premium chips on the PDP.')
                            ->columnSpanFull(),

                        Select::make('related_product_ids')
                            ->label('Cross-Sell Picker (You May Also Like)')
                            ->multiple()
                            ->options(fn () => \App\Models\Product::pluck('name', 'id')->toArray())
                            ->searchable()
                            ->preload()
                            ->helperText('Choose up to 8 products to show in the related products slider.')
                            ->columnSpanFull(),

                        Toggle::make('enable_guest_reviews')
                            ->label('Enable Guest Reviews')
                            ->default(true)
                            ->helperText('If OFF, only verified customers who purchased the product can leave reviews.'),
                    ]),
                Section::make('🔍 Search & Filter Attributes')
                    ->description('These fields directly power the sidebar filters on the Collections page.')
                    ->collapsible()
                    ->columns(3)
                    ->components([
                        TextInput::make('format')
                            ->label('Format / Product Type')
                            ->placeholder('e.g. powder, drops, liquid')
                            ->helperText('Powers the "Format" filter.')
                            ->required(),

                        TextInput::make('type')
                            ->label('Sweetener Type')
                            ->placeholder('e.g. stevia, monk-fruit'),

                        TagsInput::make('size_label')
                            ->label('Pack Size Tags')
                            ->placeholder('e.g. 50g, 100g')
                            ->helperText('Powers the "Pack Size" filter.')
                            ->separator(','),

                        TextInput::make('sweetness_description')
                            ->label('Sweetness Description')
                            ->placeholder('e.g. 1g replaces 10g of sugar')
                            ->columnSpan(2),

                        TextInput::make('use_case')
                            ->label('Ideal Use Cases')
                            ->placeholder('e.g. tea, coffee, smoothies')
                            ->columnSpan(3),
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
