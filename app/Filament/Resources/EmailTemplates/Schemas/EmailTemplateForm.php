<?php

namespace App\Filament\Resources\EmailTemplates\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class EmailTemplateForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Template Information')
                    ->columns(2)
                    ->components([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, $set, $operation) => 
                                $operation === 'create' ? $set('slug', \Str::slug($state)) : null
                            ),
                        
                        TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->helperText('Unique identifier for this template'),
                        
                        TextInput::make('subject')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull()
                            ->helperText('Email subject line. You can use variables like {{customer_name}}'),
                        
                        Toggle::make('status')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Only active templates can be used in campaigns'),
                    ]),
                
                Section::make('Email Content')
                    ->components([
                        RichEditor::make('html_content')
                            ->label('HTML Content')
                            ->required()
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'link',
                                'bulletList',
                                'orderedList',
                                'blockquote',
                                'codeBlock',
                                'undo',
                                'redo',
                            ])
                            ->helperText('Use variables like {{customer_name}}, {{order_id}}, {{product_name}}, {{unsubscribe_link}}'),
                    ]),
                
                Section::make('Demo Variables')
                    ->description('Define sample values for testing and preview')
                    ->collapsible()
                    ->components([
                        KeyValue::make('demo_variables')
                            ->label('Variables')
                            ->keyLabel('Variable Name')
                            ->valueLabel('Demo Value')
                            ->addActionLabel('Add Variable')
                            ->helperText('Example: customer_name => John Doe')
                            ->default([
                                'customer_name' => 'John Doe',
                                'customer_email' => 'john@example.com',
                                'unsubscribe_link' => url('/unsubscribe/demo-token'),
                            ]),
                    ]),
            ]);
    }
}
