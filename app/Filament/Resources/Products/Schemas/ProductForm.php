<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Product;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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
                            ->afterStateUpdated(fn (string $operation, $state, $set) => $operation === 'create' ? $set('slug', str($state)->slug()) : null),
                        TextInput::make('slug')
                            ->disabledOn('edit')
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
                    ]),
                Section::make('Pricing & Inventory (Default)')
                    ->description('These values serve as defaults if no variants are specified.')
                    ->columns(3)
                    ->collapsed()
                    ->components([
                        TextInput::make('price')
                            ->numeric()
                            ->prefix('₹'),
                        TextInput::make('original_price')
                            ->numeric()
                            ->prefix('₹'),
                        TextInput::make('badge')
                            ->placeholder('e.g. Best Seller, New'),
                        Toggle::make('in_stock')
                            ->default(true),
                        Toggle::make('is_featured')
                            ->label('Featured Product')
                            ->helperText('Show this product on the homepage')
                            ->default(false),
                    ]),
                Section::make('Global Media')
                    ->description('Fallback images if variants have no specific media.')
                    ->collapsed()
                    ->components([
                        \Filament\Forms\Components\Repeater::make('gallery')
                            ->relationship('gallery', function ($query) {
                                if (\Illuminate\Support\Facades\Schema::hasColumn('product_images', 'variant_id')) {
                                    return $query->whereNull('variant_id');
                                }
                                // If column is missing, don't add the WHERE clause at all
                                return $query;
                            })
                            ->schema([
                                FileUpload::make('image_path')
                                    ->label('Image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('products')
                                    ->required()
                                    ->columnSpanFull(),
                                \Filament\Schemas\Components\Group::make([
                                    Toggle::make('is_main')
                                        ->label('Main Image')
                                        ->default(false)
                                        ->inline(false),
                                    TextInput::make('sort_order')
                                        ->numeric()
                                        ->default(0)
                                        ->label('Sort Order'),
                                ]),
                            ])
                            ->grid([
                                'default' => 1,
                                'md' => 2,
                                'xl' => 3,
                            ])
                            ->defaultItems(0)
                            ->reorderableWithButtons()
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['image_path'] ?? null),
                    ]),
                Section::make('Product Variants')
                    ->description('Manage weight/pack variants for this product. If variants exist, they will override the base price/stock on the frontend.')
                    ->components([
                        \Filament\Forms\Components\Repeater::make('variants')
                            ->relationship()
                            ->schema([
                                TextInput::make('weight')
                                    ->placeholder('e.g. 100g, 250g, 1kg')
                                    ->required(),
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
                                \Filament\Forms\Components\Repeater::make('images')
                                    ->relationship('images')
                                    ->schema([
                                        \Filament\Forms\Components\Hidden::make('product_id')
                                            ->default(function ($get) {
                                                // Try to get product_id from the variant repeater state
                                                return $get('../../product_id') ?? $get('../../../id');
                                            }),
                                        FileUpload::make('image_path')
                                            ->label('Image')
                                            ->image()
                                            ->disk('public')
                                            ->directory('variants')
                                            ->required()
                                            ->columnSpanFull(),
                                        \Filament\Schemas\Components\Group::make([
                                            Toggle::make('is_main')
                                                ->label('Main Image')
                                                ->default(false)
                                                ->inline(false),
                                            TextInput::make('sort_order')
                                                ->numeric()
                                                ->default(0)
                                                ->label('Sort Order'),
                                        ]),
                                    ])
                                    ->grid(2)
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['image_path'] ?? null)
                                    ->columnSpanFull()
                                    ->hidden(fn () => !\Illuminate\Support\Facades\Schema::hasColumn('product_images', 'variant_id')),
                            ])
                            ->columns(3)
                            ->itemLabel(fn (array $state): ?string => ($state['weight'] ?? '') . ' - Pack of ' . ($state['pack_size'] ?? '1'))
                            ->collapsible(),
                    ]),
                Section::make('Additional Data')
                    ->components([
                        TagsInput::make('ingredients')
                            ->label('Ingredients')
                            ->placeholder('Add ingredient...')
                            ->suggestions([
                                'Organic Stevia Leaf Extract',
                                'Monk Fruit Extract',
                                'Erythritol',
                                'Natural Fiber',
                            ]),
                    ]),
            ]);
    }
}
