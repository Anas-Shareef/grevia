<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Models\User;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('User Details')
                    ->columns(2)
                    ->components([
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(User::class, 'email', ignoreRecord: true),
                        TextInput::make('password')
                            ->password()
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $operation): bool => $operation === 'create'),
                        Select::make('roles')
                            ->relationship('roles', 'name')
                            ->multiple()
                            ->preload()
                            ->searchable(),
                    ]),
                Section::make('Review Statistics')
                    ->columns(2)
                    ->components([
                        \Filament\Forms\Components\Placeholder::make('total_reviews')
                            ->label('Total Reviews Submitted')
                            ->content(fn ($record) => $record ? $record->reviews()->count() : 0),
                        \Filament\Forms\Components\Placeholder::make('average_rating')
                            ->label('Average Rating Given')
                            ->content(fn ($record) => $record ? number_format($record->reviews()->avg('rating'), 1) : '-'),
                    ])
                    ->hidden(fn ($record) => !$record),
            ]);
    }
}
