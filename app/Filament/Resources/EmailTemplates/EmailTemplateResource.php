<?php

namespace App\Filament\Resources\EmailTemplates;

use App\Filament\Resources\EmailTemplates\Pages\CreateEmailTemplate;
use App\Filament\Resources\EmailTemplates\Pages\EditEmailTemplate;
use App\Filament\Resources\EmailTemplates\Pages\ListEmailTemplates;
use App\Filament\Resources\EmailTemplates\Schemas\EmailTemplateForm;
use App\Filament\Resources\EmailTemplates\Tables\EmailTemplatesTable;
use App\Models\EmailTemplate;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class EmailTemplateResource extends Resource
{
    protected static ?string $model = EmailTemplate::class;
    
    protected static string|\UnitEnum|null $navigationGroup = 'Marketing';
    
    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'name';
    
    // Prevent access until migrations are run on production
    public static function canAccess(): bool
    {
        try {
            return \Schema::hasTable('email_templates');
        } catch (\Exception $e) {
            return false;
        }
    }
    
    public static function canViewAny(): bool
    {
        return static::canAccess();
    }
    
    public static function shouldRegisterNavigation(): bool
    {
        return static::canAccess();
    }

    public static function form(Schema $schema): Schema
    {
        return EmailTemplateForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EmailTemplatesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListEmailTemplates::route('/'),
            'create' => CreateEmailTemplate::route('/create'),
            'edit' => EditEmailTemplate::route('/{record}/edit'),
        ];
    }
    
    public static function getEditHeaderActions(): array
    {
        return [
            \Filament\Actions\Action::make('preview')
                ->label('Preview')
                ->icon('heroicon-o-eye')
                ->color('gray')
                ->modalHeading('Email Preview')
                ->modalWidth('3xl')
                ->modalContent(fn ($record) => view('filament.email-preview', [
                    'content' => $record->render($record->demo_variables ?? []),
                ]))
                ->modalSubmitAction(false)
                ->modalCancelActionLabel('Close'),
            
            \Filament\Actions\Action::make('test_send')
                ->label('Send Test')
                ->icon('heroicon-o-paper-airplane')
                ->color('primary')
                ->form([
                    \Filament\Forms\Components\TextInput::make('test_email')
                        ->label('Send to Email')
                        ->email()
                        ->required()
                        ->default(fn () => auth()->user()->email)
                        ->helperText('Enter the email address to send a test email'),
                ])
                ->action(function ($record, array $data) {
                    try {
                        \Mail::to($data['test_email'])->send(
                            new \App\Mail\TestEmail(
                                emailSubject: $record->subject,
                                htmlContent: $record->html_content,
                                variables: $record->demo_variables ?? []
                            )
                        );
                        
                        \Filament\Notifications\Notification::make()
                            ->title('Test email sent successfully!')
                            ->success()
                            ->body("Email sent to {$data['test_email']}")
                            ->send();
                    } catch (\Exception $e) {
                        \Filament\Notifications\Notification::make()
                            ->title('Failed to send test email')
                            ->danger()
                            ->body($e->getMessage())
                            ->send();
                    }
                }),
        ];
    }
}
