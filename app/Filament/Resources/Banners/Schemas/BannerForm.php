<?php

namespace App\Filament\Resources\Banners\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;

class BannerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Heading (Main Title)')
                    ->helperText('Use <br> for line breaks. Wrap highlighted text in <span class="text-gradient-forest">...</span> for green gradient.')
                    ->required(),
                Textarea::make('description')
                    ->rows(3),
                FileUpload::make('image')
                    ->image()
                    ->disk('public')
                    ->directory('banners')
                    ->required(),
                
                // Button 1
                TextInput::make('primary_button_text'),
                TextInput::make('primary_button_link'),

                // Button 2
                TextInput::make('secondary_button_text'),
                TextInput::make('secondary_button_link'),

                // Features
                Repeater::make('features')
                    ->schema([
                        TextInput::make('text')->required(),
                        Select::make('icon')
                            ->options([
                                'Sparkles' => 'Sparkles',
                                'Award' => 'Award',
                                'Heart' => 'Heart',
                            ])
                            ->required(),
                    ])
                    ->columns(2),

                // Legacy Link (keep if needed, or hide)
                TextInput::make('link')
                    ->url()
                    ->label('General Link (Fallback)'),

                Select::make('type')
                    ->options([
                        'hero' => 'Hero Banner',
                        'category' => 'Category Banner',
                        'campaign' => 'Campaign Banner',
                    ])
                    ->required()
                    ->native(false),
                Toggle::make('status')
                    ->default(true),
                TextInput::make('order')
                    ->numeric()
                    ->default(0),
            ]);
    }
}
