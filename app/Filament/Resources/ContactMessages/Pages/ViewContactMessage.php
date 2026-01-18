<?php

namespace App\Filament\Resources\ContactMessages\Pages;

use App\Filament\Resources\ContactMessages\ContactMessageResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewContactMessage extends ViewRecord
{
    protected static string $resource = ContactMessageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\Action::make('reply')
                ->label('Reply to Customer')
                ->icon('heroicon-o-paper-airplane')
                ->color('primary')
                ->form([
                    \Filament\Forms\Components\RichEditor::make('reply_content')
                        ->label('Message')
                        ->required(),
                ])
                ->action(function (array $data, \App\Models\ContactMessage $record) {
                    $replyContent = $data['reply_content'];

                    // Send Email
                    \Illuminate\Support\Facades\Mail::to($record->email)
                        ->send(new \App\Mail\AdminContactReply($record, $replyContent));

                    // Update Record
                    $record->update([
                        'status' => 'replied',
                        'admin_reply' => $replyContent,
                        'replied_at' => now(),
                    ]);

                    \Filament\Notifications\Notification::make()
                        ->title('Reply sent successfully')
                        ->success()
                        ->send();
                })
                ->visible(fn ($record) => $record->status !== 'closed'),
        ];
    }
}
