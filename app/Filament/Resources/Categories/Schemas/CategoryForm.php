<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;
use App\Models\Category;
use Filament\Schemas\Schema;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('General Details')
                    ->components([
                        TextInput::make('name')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, $set) => $set('slug', str($state)->slug())),
                        TextInput::make('slug')
                            ->required()
                            ->unique(Category::class, 'slug', ignoreRecord: true)
                            ->helperText('Auto-generated from name. Used in URLs (e.g. stevia-powder).'),
                        Select::make('parent_id')
                            ->label('Parent Category')
                            ->relationship('parent', 'name')
                            ->searchable()
                            ->preload()
                            ->placeholder('— None (Top-level category) —'),
                        TextInput::make('order')
                            ->required()
                            ->numeric()
                            ->default(0)
                            ->helperText('Lower number = appears first.'),
                        Textarea::make('description')
                            ->columnSpanFull(),
                        Toggle::make('status')
                            ->label('Active')
                            ->default(true),
                        Toggle::make('show_in_filter')
                            ->label('Show in Filter Sidebar')
                            ->helperText('Enable to show this category in the shop dropdown and filter panel.')
                            ->default(true),
                    ])->columns(2),

                Section::make('Visual Branding')
                    ->description('Upload high-resolution banners and menu icons. These are shown automatically when a customer visits this category.')
                    ->components([
                        FileUpload::make('image')
                            ->label('Grid Thumbnail')
                            ->helperText('Recommended: 400×400px square. Shown on the collections landing page tile.')
                            ->image()
                            ->disk('public')
                            ->directory('categories')
                            ->imagePreviewHeight('160'),
                        FileUpload::make('icon')
                            ->label('Navbar Menu Icon')
                            ->helperText('Recommended: 80×80px PNG/SVG. Shown in the navigation mega-menu next to the category name.')
                            ->image()
                            ->disk('public')
                            ->directory('categories/icons')
                            ->imagePreviewHeight('160'),
                        FileUpload::make('hero_banner')
                            ->label('Collection Hero Banner')
                            ->helperText('Recommended: 1600×500px. This image appears as the full-width header at the top of the collection page when a customer clicks this category.')
                            ->image()
                            ->disk('public')
                            ->directory('categories/banners')
                            ->imagePreviewHeight('200')
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('SEO Details')
                    ->description('Control how this collection lands inside Google & organic searches.')
                    ->components([
                        TextInput::make('seo_title')
                            ->label('SEO Indexing Title')
                            ->maxLength(70),
                        Textarea::make('seo_description')
                            ->label('SEO Meta Description')
                            ->maxLength(160)
                    ])
                    ->collapsed(),
            ]);
    }
}
