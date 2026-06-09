<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Infolists\Components\TextEntry;

class ContactMessageInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Message Details')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('full_name'),
                        TextEntry::make('email')
                            ->copyable(),
                        TextEntry::make('phone')
                            ->placeholder('-'),
                        TextEntry::make('subject')
                            ->columnSpanFull(),
                        TextEntry::make('created_at')
                            ->label('Received At')
                            ->dateTime(),
                        TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'new' => 'danger',
                                'read' => 'warning',
                                'replied' => 'success',
                                'closed' => 'gray',
                                default => 'gray',
                            }),
                        TextEntry::make('message')
                            ->columnSpanFull()
                            ->html(),
                    ]),
                Section::make('Admin Reply')
                    ->visible(fn ($record) => $record && !empty($record->admin_reply))
                    ->schema([
                        TextEntry::make('replied_at')
                            ->dateTime()
                            ->placeholder('-'),
                        TextEntry::make('admin_reply')
                            ->html()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
