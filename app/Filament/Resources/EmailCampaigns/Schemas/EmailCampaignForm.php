<?php

namespace App\Filament\Resources\EmailCampaigns\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class EmailCampaignForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Section::make('Campaign Details')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->label('Internal Campaign Name'),
                        TextInput::make('subject')
                            ->required()
                            ->columnSpanFull(),
                        \Filament\Forms\Components\RichEditor::make('content_html')
                            ->label('Email Content')
                            ->columnSpanFull(),
                    ]),
                \Filament\Schemas\Components\Section::make('Call to Action')
                    ->schema([
                        \Filament\Schemas\Components\Grid::make(2)
                            ->components([
                                TextInput::make('cta_text')
                                    ->label('Button Text'),
                                TextInput::make('cta_link')
                                    ->label('Button Link')
                                    ->url(),
                            ]),
                    ]),
                \Filament\Schemas\Components\Section::make('Settings')
                    ->schema([
                        \Filament\Schemas\Components\Grid::make(3)
                            ->components([
                                \Filament\Forms\Components\Select::make('status')
                                    ->options([
                                        'draft' => 'Draft',
                                        'scheduled' => 'Scheduled',
                                        'sent' => 'Sent',
                                    ])
                                    ->required()
                                    ->default('draft'),
                                DateTimePicker::make('scheduled_at'),
                                DateTimePicker::make('sent_at')
                                    ->disabled(), // Should be set by system
                            ]),
                    ]),
            ]);
    }
}
