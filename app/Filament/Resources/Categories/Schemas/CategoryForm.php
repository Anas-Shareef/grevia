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
                            ->relationship('parent', 'name', fn (\Illuminate\Database\Eloquent\Builder $query) => $query->whereNull('parent_id'))
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

                Section::make('Editorial Collection Card')
                    ->description('These settings control the large editorial card on the collection grid.')
                    ->components([
                        FileUpload::make('card_image_url')
                            ->label('Card Background Image')
                            ->helperText('Photography rule: Product right, white space left. Minimum 1400x800px.')
                            ->image()
                            ->imageCropAspectRatio('1.75:1')
                            ->imageResizeTargetWidth('1400')
                            ->imageResizeTargetHeight('800')
                            ->disk('public')
                            ->directory('categories/editorial')
                            ->columnSpanFull()
                            ->live(),
                        
                        Textarea::make('card_description')
                            ->label('Editorial Card Subtitle')
                            ->helperText('Max 100 characters. Describe the collection benefit.')
                            ->maxLength(100)
                            ->required()
                            ->live()
                            ->columnSpanFull(),

                        Select::make('availability_status')
                            ->label('Card Display Status')
                            ->options([
                                'active' => 'Active (Link to Category)',
                                'coming_soon' => 'Coming Soon (Decorative Badge)',
                                'hidden' => 'Hidden (Do Not Show)',
                            ])
                            ->default('active')
                            ->required()
                            ->live(),

                        \Filament\Forms\Components\Slider::make('overlay_density')
                            ->label('Gradient Overlay Density')
                            ->helperText('Adjust for text legibility. 40 (light) to 100 (dark). Default is 72.')
                            ->minValue(40)
                            ->maxValue(100)
                            ->default(72)
                            ->step(1)
                            ->live(),

                        Placeholder::make('editorial_preview')
                            ->label('Editorial Card Preview')
                            ->content(function ($get, $record) {
                                $name = $get('name') ?? 'Category Name';
                                $desc = $get('card_description') ?? 'Your editorial subtitle will appear here...';
                                $density = ($get('overlay_density') ?? 72) / 100;
                                $status = $get('availability_status') ?? 'active';
                                $image = $get('card_image_url');
                                
                                $bgUrl = $image 
                                    ? \Illuminate\Support\Facades\Storage::url($image) 
                                    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop';

                                return new \Illuminate\Support\HtmlString("
                                    <div style=\"
                                        width: 100%;
                                        max-width: 400px;
                                        height: 228px;
                                        border-radius: 24px;
                                        overflow: hidden;
                                        position: relative;
                                        background: #1a2a1e;
                                        font-family: 'Montserrat', sans-serif;
                                    \">
                                        <img src=\"{$bgUrl}\" style=\"width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0;\" />
                                        
                                        <div style=\"
                                            position: absolute;
                                            inset: 0;
                                            background: linear-gradient(
                                                to bottom,
                                                transparent 0%,
                                                transparent 20%,
                                                rgba(0, 0, 0, " . (0.18 * $density / 0.72) . ") 45%,
                                                rgba(0, 0, 0, " . (0.60 * $density / 0.72) . ") 70%,
                                                rgba(0, 0, 0, " . (0.78 * $density / 0.72) . ") 100%
                                            );
                                        \"></div>

                                        <div style=\"position: absolute; bottom: 16px; left: 16px; right: 16px; z-index: 2; color: white;\">
                                            <h3 style=\"margin: 0 0 4px; font-size: 18px; font-weight: 800; text-transform: none; letter-spacing: -0.01em; max-width: 70%;\">{$name}</h3>
                                            <p style=\"margin: 0 0 10px; font-size: 10px; opacity: 0.9; line-height: 1.4; max-width: 65%; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;\">{$desc}</p>
                                            
                                            " . ($status === 'active' 
                                                ? "<div style=\"display: inline-flex; padding: 6px 12px; border: 1px solid white; border-radius: 20px; font-size: 8px; font-weight: 600;\">Explore Products →</div>"
                                                : "<div style=\"display: inline-flex; padding: 5px 10px; border: 1px solid rgba(255,255,255,0.5); background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 8px; font-weight: 600; color: rgba(255,255,255,0.7);\">Coming Soon</div>"
                                            ) . "
                                        </div>
                                    </div>
                                ");
                            })
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
