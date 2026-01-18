<?php

namespace App\Filament\Resources\Subscribers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SubscriberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('name'),
                TextInput::make('user_id')
                    ->numeric(),
                Toggle::make('is_subscribed')
                    ->required(),
                \Filament\Forms\Components\Select::make('source')
                    ->options([
                        'popup' => 'Popup',
                        'footer' => 'Footer',
                        'register' => 'Registration Checkbox',
                        'auto' => 'Auto-Subscribe',
                    ])
                    ->required()
                    ->default('footer'),
            ]);
    }
}
