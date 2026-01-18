<?php

namespace App\Filament\Resources\BenefitsPages\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Schema;

class BenefitsPageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Page Title (Internal Only)')
                    ->required(),

                // 1. HERO SECTION
                Section::make('Hero Section')
                    ->statePath('hero')
                    ->collapsed()
                    ->components([
                        TextInput::make('badge')
                            ->label('Hero Badge (Optional)')
                            ->placeholder('e.g., Natural Sweeteners'),
                        TextInput::make('title')
                            ->label('Hero Title')
                            ->required(),
                        Textarea::make('subtitle')
                            ->label('Hero Subtitle')
                            ->rows(3)
                            ->required(),
                        FileUpload::make('background_image')
                            ->label('Hero Background Image')
                            ->image()
                            ->disk('public')
                            ->directory('benefits-page'),
                    ]),

                // 2. STORY SECTIONS (Main Content)
                Section::make('Benefit Stories')
                    ->description('Manage the main content sections (e.g. Stevia, Monk Fruit).')
                    ->collapsed()
                    ->components([
                        Repeater::make('sections')
                            ->label('Stories')
                            ->statePath('sections')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        TextInput::make('badge')->label('Badge'),
                                        TextInput::make('title')->label('Title')->required(),
                                    ]),
                                Textarea::make('description')->rows(3)->required(),
                                FileUpload::make('image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('benefits-page'),
                                Select::make('alignment')
                                    ->options(['left' => 'Left', 'right' => 'Right'])
                                    ->default('right'),
                                
                                // Feature Cards for each section
                                Repeater::make('features')
                                    ->label('Feature Cards')
                                    ->statePath('features')
                                    ->schema([
                                        Select::make('icon')
                                            ->options([
                                                'Leaf' => 'Leaf',
                                                'Heart' => 'Heart',
                                                'Zap' => 'Zap',
                                                'Scale' => 'Scale',
                                                'Brain' => 'Brain',
                                                'Shield' => 'Shield',
                                                'Sparkles' => 'Sparkles',
                                                'Droplets' => 'Droplets',
                                            ])
                                            ->required(),
                                        TextInput::make('title')->required(),
                                        Textarea::make('description')->rows(2),
                                    ])
                                    ->collapsed()
                                    ->itemLabel(fn (array $state): ?string => $state['title'] ?? null),
                            ])
                            ->collapsed()
                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? null),
                    ]),

                // 3. COMPARISON SECTION
                Section::make('Comparison Section')
                    ->statePath('comparison')
                    ->collapsed()
                    ->components([
                        TextInput::make('title')->required(),
                        Textarea::make('subtitle'),
                        
                        Repeater::make('columns')
                            ->label('Comparison Columns')
                            ->statePath('columns')
                            ->schema([
                                FileUpload::make('image')
                                    ->label('Column Logo/Image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('benefits-page')
                                    ->columnSpanFull(),
                                TextInput::make('title')->required(),
                                Select::make('type')
                                    ->options([
                                        'danger' => 'Red (Bad)',
                                        'success' => 'Green (Good)',
                                        'neutral' => 'Black (Artificial/Neutral)', // Added neutral option
                                    ])
                                    ->default('danger'),
                                
                                Repeater::make('points')
                                    ->statePath('points')
                                    ->schema([
                                        TextInput::make('text')->required(),
                                        Select::make('type')
                                            ->options([
                                                'danger' => 'Cross (X)', 
                                                'success' => 'Check (✓)',
                                                'warning' => 'Alert (!)', // Added warning option
                                            ])
                                            ->default('danger'),
                                    ])
                                    ->collapsed()
                                    ->itemLabel(fn (array $state): ?string => $state['text'] ?? null),
                            ])
                            ->collapsed()
                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? null),
                    ]),

                // 4. CTA SECTION
                Section::make('Call to Action (CTA)')
                    ->statePath('cta')
                    ->collapsed()
                    ->components([
                        TextInput::make('title')
                            ->label('CTA Title'),
                        Textarea::make('subtitle')
                            ->label('CTA Subtitle')
                            ->rows(2),
                        TextInput::make('button_text')
                            ->label('Button Text'),
                        TextInput::make('button_link')
                            ->label('Button Link')
                            ->url(),
                        FileUpload::make('background_image')
                            ->label('CTA Background Image')
                            ->image()
                            ->disk('public')
                            ->directory('benefits-page'),
                    ]),
                
                // 5. SEO & SETTINGS
                Section::make('SEO & Settings')
                    ->collapsed()
                    ->components([
                        TextInput::make('meta_title')
                            ->label('SEO Meta Title')
                            ->placeholder('Title for search engines'),
                        Textarea::make('meta_description')
                            ->label('SEO Meta Description')
                            ->rows(3),
                        Toggle::make('is_active')
                            ->label('Page Active')
                            ->default(true),
                    ]),
            ]);
    }
}
