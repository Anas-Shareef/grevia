<?php

namespace App\Filament\Resources\FooterSections\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Get;
use Filament\Schemas\Schema;

class FooterSectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('section_name')
                    ->required(),
                Select::make('type')
                    ->options([
                        'text' => 'Text Content',
                        'links' => 'Link List',
                        'social' => 'Social Links',
                    ])
                    ->required()
                    ->default('text')
                    ->live(),
                
                // Text Content
                RichEditor::make('content.text')
                    ->label('Text Body')
                    ->visible(fn ($get) => $get('type') === 'text')
                    ->columnSpanFull(),

                // Link List
                Repeater::make('content.links')
                    ->label('Links')
                    ->schema([
                        TextInput::make('label')->required(),
                        TextInput::make('url')
                            ->url()
                            ->required()
                            ->prefix('https://'),
                    ])
                    ->visible(fn ($get) => $get('type') === 'links')
                    ->columnSpanFull(),

                // Social Links
                Repeater::make('content.socials')
                    ->label('Social Profiles')
                    ->schema([
                        Select::make('platform')
                            ->options([
                                'facebook' => 'Facebook',
                                'twitter' => 'Twitter',
                                'instagram' => 'Instagram',
                                'linkedin' => 'LinkedIn',
                                'youtube' => 'YouTube',
                            ])
                            ->required(),
                        TextInput::make('url')
                            ->url()
                            ->required(),
                    ])
                    ->visible(fn ($get) => $get('type') === 'social')
                    ->columnSpanFull(),

                Toggle::make('is_active')
                    ->required()
                    ->default(true),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
