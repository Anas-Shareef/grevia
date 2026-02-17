<?php

namespace App\Filament\Resources\EmailCampaigns\Schemas;

use App\Services\EmailSegmentationService;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class EmailCampaignForm
{
    public static function configure(Schema $schema): Schema
    {
        $segments = EmailSegmentationService::getAvailableSegments();
        
        return $schema
            ->columns(2)
            ->components([
                Section::make('Campaign Details')
                    ->columns(2)
                    ->columnSpan(2)
                    ->components([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        
                        TextInput::make('subject')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull()
                            ->helperText('Email subject line. You can use variables like {{customer_name}}'),
                        
                        Select::make('email_template_id')
                            ->label('Email Template')
                            ->relationship('template', 'name')
                            ->searchable()
                            ->preload()
                            ->helperText('Choose a pre-designed template or leave empty to use custom content below'),
                        
                        Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'scheduled' => 'Scheduled',
                                'sending' => 'Sending',
                                'sent' => 'Sent',
                                'failed' => 'Failed',
                            ])
                            ->default('draft')
                            ->required(),
                        
                        DateTimePicker::make('scheduled_at')
                            ->label('Schedule For')
                            ->helperText('Leave empty to send immediately')
                            ->columnSpanFull(),
                    ]),
                
                Section::make('Target Audience')
                    ->description('Choose who will receive this campaign')
                    ->columns(1)
                    ->columnSpan(2)
                    ->components([
                        Select::make('target_segment')
                            ->label('Recipient Segment')
                            ->options(collect($segments)->mapWithKeys(fn($seg, $key) => [
                                $key => $seg['label'] . ' - ' . $seg['use_case']
                            ]))
                            ->default('all_consented')
                            ->required()
                            ->live()
                            ->afterStateUpdated(function ($state, $set) {
                                $service = new EmailSegmentationService();
                                $count = $service->getRecipientCount($state);
                                $set('total_recipients', $count);
                            }),
                        
                        Placeholder::make('recipient_preview')
                            ->label('Estimated Recipients')
                            ->content(function ($get) {
                                $segment = $get('target_segment') ?? 'all_consented';
                                $service = new EmailSegmentationService();
                                $count = $service->getRecipientCount($segment);
                                
                                $segments = EmailSegmentationService::getAvailableSegments();
                                $segmentInfo = $segments[$segment] ?? null;
                                
                                return view('filament.components.recipient-preview', [
                                    'count' => $count,
                                    'segment' => $segmentInfo,
                                ]);
                            }),
                    ]),
                
                Section::make('Email Content')
                    ->description('Custom HTML content (optional if using template)')
                    ->columnSpan(2)
                    ->collapsible()
                    ->components([
                        RichEditor::make('html_content')
                            ->label('HTML Content')
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'underline',
                                'link',
                                'bulletList',
                                'orderedList',
                            ])
                            ->helperText('Use variables like {{customer_name}}, {{order_id}}, {{unsubscribe_link}}'),
                    ]),
            ]);
    }
}
