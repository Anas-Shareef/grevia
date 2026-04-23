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
                            ->unique(Category::class, 'slug', ignoreRecord: true),
                        Textarea::make('description')
                            ->columnSpanFull(),
                        FileUpload::make('image')
                            ->image()
                            ->disk('public')
                            ->directory('categories'),
                        Select::make('parent_id')
                            ->label('Parent Category')
                            ->relationship('parent', 'name')
                            ->searchable()
                            ->placeholder('Select a parent category'),
                        Toggle::make('status')
                            ->label('Active')
                            ->default(true),
                        Toggle::make('show_in_filter')
                            ->label('Show in Navigation Menu')
                            ->helperText('Enable this to show the category in the "Shop by Category" dropdown mega-menu.')
                            ->default(true),
                        TextInput::make('order')
                            ->required()
                            ->numeric()
                            ->default(0),
                    ])->columns(2),

                Section::make('Visual Branding')
                    ->description('Upload high-resolution banners and menu icons for this collection.')
                    ->components([
                        FileUpload::make('image')
                            ->label('Grid Thumbnail')
                            ->helperText('Shown in product cards or listing grids.')
                            ->image()
                            ->disk('public')
                            ->directory('categories'),
                        FileUpload::make('icon')
                            ->label('Menu Icon (SVG/PNG)')
                            ->helperText('Shown in the navigation mega-menu.')
                            ->image()
                            ->disk('public')
                            ->directory('categories/icons'),
                        FileUpload::make('hero_banner')
                            ->label('Hero Banner (Desktop)')
                            ->helperText('The large header image shown at the top of the collection page.')
                            ->image()
                            ->disk('public')
                            ->directory('categories/banners')
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
