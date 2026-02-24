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
                    ->description('Fallback image shown if a variant has no specific photo.')
                    ->collapsed()
                    ->components([
                        FileUpload::make('image')
                            ->label('Product Image')
                            ->helperText('This image is shown when no variant-specific photo is available.')
                            ->image()
                            ->disk('public')
                            ->directory('products')
                            ->imagePreviewHeight('200')
                            ->columnSpanFull(),
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
                                \Filament\Forms\Components\Repeater::make('variantImages')
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
