<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
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
                    ->schema([
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
                            ->label('Show in Filter')
                            ->helperText('Enable this to show the category in the shop dropdown filters.')
                            ->default(true),
                        TextInput::make('order')
                            ->required()
                            ->numeric()
                            ->default(0),
                    ])->columns(2),

                Section::make('Smart Collection Engine')
                    ->description('Automatically categorize products dynamically based on tag or naming logic instead of manual assignments.')
                    ->schema([
                        Toggle::make('is_smart')
                            ->label('Enable Smart Rule-Based Engine')
                            ->live()
                            ->columnSpanFull(),
                        
                        Repeater::make('rules')
                            ->schema([
                                Select::make('field')
                                    ->options([
                                        'tags' => 'Product Tags',
                                        'name' => 'Product Title',
                                        'price' => 'Price',
                                        'form' => 'Form (drops, powder)',
                                        'type' => 'Type (stevia, monk-fruit)'
                                    ])
                                    ->required(),
                                Select::make('operator')
                                    ->options([
                                        'contains' => 'Contains',
                                        'equals' => 'Equals Exactly',
                                        '>=' => 'Greater Than or Equal',
                                        '<=' => 'Less Than or Equal',
                                    ])
                                    ->required(),
                                TextInput::make('value')
                                    ->required()
                            ])
                            ->columns(3)
                            ->columnSpanFull()
                            ->visible(fn (\Filament\Forms\Get $get): bool => $get('is_smart') === true)
                            ->addActionLabel('Add New Automation Rule')
                    ]),

                Section::make('SEO Details')
                    ->description('Control how this collection lands inside Google & organic searches.')
                    ->schema([
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
