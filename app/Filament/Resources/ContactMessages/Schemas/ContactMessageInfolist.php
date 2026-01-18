<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use Filament\Schemas\Schema;



class ContactMessageInfolist
{
    public static function configure(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema
    {
        return $schema
            ->schema([
                \Filament\Schemas\Components\Section::make('Message Details')
                    ->columns(2)
                    ->schema([
                        \Filament\Forms\Components\TextInput::make('full_name')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('email')
                            ->email()
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('phone')
                            ->disabled(),
                        \Filament\Forms\Components\TextInput::make('subject')
                            ->columnSpanFull()
                            ->disabled(),
                        \Filament\Forms\Components\DateTimePicker::make('created_at')
                            ->label('Received At')
                            ->disabled(),
                        \Filament\Forms\Components\Select::make('status')
                            ->options([
                                'new' => 'New',
                                'read' => 'Read',
                                'replied' => 'Replied',
                                'closed' => 'Closed',
                            ])
                            ->disabled(),
                        \Filament\Forms\Components\Textarea::make('message')
                            ->columnSpanFull()
                            ->disabled(),
                    ]),
                \Filament\Schemas\Components\Section::make('Admin Reply')
                    ->visible(fn ($record) => filled($record->admin_reply))
                    ->schema([
                        \Filament\Forms\Components\DateTimePicker::make('replied_at')
                            ->disabled(),
                        \Filament\Forms\Components\RichEditor::make('admin_reply')
                            ->disabled(),
                    ]),
            ]);
    }
}
