<?php

namespace App\Filament\Resources\Banners\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BannerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Content')
                    ->description('Text shown on the banner.')
                    ->columns(2)
                    ->components([
                        TextInput::make('badge_text')
                            ->label('Top Badge Text')
                            ->placeholder('e.g. 100% Natural Sweeteners')
                            ->helperText('The small green badge shown above the headline.')
                            ->hidden(fn () => !\Illuminate\Support\Facades\Schema::hasColumn('banners', 'badge_text'))
                            ->columnSpanFull(),

                        Textarea::make('title')
                            ->label('Headline')
                            ->helperText('Use <br> for line breaks. Wrap a word in <span class="text-gradient-forest">...</span> to make it green.')
                            ->rows(3)
                            ->required()
                            ->columnSpanFull(),

                        Textarea::make('description')
                            ->label('Sub-text')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                Section::make('Image')
                    ->description('The hero product photo shown on the right side.')
                    ->components([
                        FileUpload::make('image')
                            ->label('Banner Image')
                            ->image()
                            ->disk('public')
                            ->directory('banners')
                            ->imagePreviewHeight('200')
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Section::make('Buttons')
                    ->description('The two action buttons below the headline.')
                    ->columns(2)
                    ->components([
                        TextInput::make('primary_button_text')
                            ->label('Button 1 Text')
                            ->placeholder('Shop Collection'),
                        TextInput::make('primary_button_link')
                            ->label('Button 1 Link')
                            ->placeholder('/collections/all'),
                        TextInput::make('secondary_button_text')
                            ->label('Button 2 Text')
                            ->placeholder('Learn More'),
                        TextInput::make('secondary_button_link')
                            ->label('Button 2 Link')
                            ->placeholder('/benefits'),
                    ]),

                Section::make('Floating Badges')
                    ->description('The small floating labels on the product image (e.g. Zero Glycemic, Keto Friendly).')
                    ->components([
                        Repeater::make('features')
                            ->schema([
                                TextInput::make('text')
                                    ->label('Badge Text')
                                    ->required(),
                                Select::make('icon')
                                    ->label('Icon')
                                    ->options([
                                        'Sparkles' => '✨ Sparkles',
                                        'Award'    => '🏅 Award',
                                        'Heart'    => '🤍 Heart',
                                    ])
                                    ->required(),
                            ])
                            ->columns(2)
                            ->addActionLabel('Add Badge')
                            ->defaultItems(0)
                            ->maxItems(3)
                            ->helperText('Maximum 3 badges. Positions: top-left, right, bottom-left.'),
                    ]),

                Section::make('Settings')
                    ->columns(3)
                    ->collapsed()
                    ->components([
                        Select::make('type')
                            ->options([
                                'hero'     => 'Hero Banner',
                                'category' => 'Category Banner',
                                'campaign' => 'Campaign Banner',
                            ])
                            ->required()
                            ->native(false)
                            ->default('hero'),
                        TextInput::make('order')
                            ->numeric()
                            ->default(0)
                            ->label('Display Order'),
                        Toggle::make('status')
                            ->label('Active')
                            ->default(true)
                            ->inline(false),
                    ]),
            ]);
    }
}
