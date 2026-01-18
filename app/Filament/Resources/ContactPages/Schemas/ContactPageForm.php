<?php

namespace App\Filament\Resources\ContactPages\Schemas;

use Filament\Schemas\Schema;

class ContactPageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Tabs::make('Contact Page CMS')
                    ->tabs([
                        \Filament\Schemas\Components\Tabs\Tab::make('Content')
                            ->icon('heroicon-o-document-text')
                            ->components([
                                \Filament\Forms\Components\TextInput::make('page_title')
                                    ->required()
                                    ->maxLength(255),
                                \Filament\Forms\Components\RichEditor::make('page_description')
                                    ->label('Page Content')
                                    ->columnSpanFull(),
                            ]),
                        \Filament\Schemas\Components\Tabs\Tab::make('Contact Info')
                            ->icon('heroicon-o-phone')
                            ->columns(2)
                            ->components([
                                \Filament\Forms\Components\TextInput::make('company_name')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('support_email')
                                    ->email()
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('phone')
                                    ->tel()
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('working_hours')
                                    ->maxLength(255),
                                \Filament\Forms\Components\Textarea::make('address')
                                    ->columnSpanFull(),
                                \Filament\Forms\Components\Textarea::make('map_embed_url')
                                    ->label('Google Map Embed URL')
                                    ->columnSpanFull()
                                    ->helperText('Paste the iframe src URL here.'),
                            ]),
                        \Filament\Schemas\Components\Tabs\Tab::make('SEO')
                            ->icon('heroicon-o-globe-alt')
                            ->components([
                                \Filament\Forms\Components\TextInput::make('meta_title')
                                    ->maxLength(255),
                                \Filament\Forms\Components\Textarea::make('meta_description')
                                    ->maxLength(255),
                            ]),
                    ])->columnSpanFull(),
                \Filament\Schemas\Components\Section::make('Settings')
                    ->components([
                        \Filament\Forms\Components\Toggle::make('status')
                            ->label('Active')
                            ->default(true),
                    ]),
            ]);
    }
}
