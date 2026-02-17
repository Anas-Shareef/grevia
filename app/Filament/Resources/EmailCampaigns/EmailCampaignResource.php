<?php

namespace App\Filament\Resources\EmailCampaigns;

use App\Filament\Resources\EmailCampaigns\Pages\CreateEmailCampaign;
use App\Filament\Resources\EmailCampaigns\Pages\EditEmailCampaign;
use App\Filament\Resources\EmailCampaigns\Pages\ListEmailCampaigns;
use App\Filament\Resources\EmailCampaigns\Schemas\EmailCampaignForm;
use App\Filament\Resources\EmailCampaigns\Tables\EmailCampaignsTable;
use App\Models\EmailCampaign;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class EmailCampaignResource extends Resource
{
    protected static ?string $model = EmailCampaign::class;
    
    protected static string|\UnitEnum|null $navigationGroup = 'Marketing';
    
    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'title';
    
    // Prevent access until migrations are run
    public static function canAccess(): bool
    {
        try {
            return \Schema::hasTable('email_campaigns');
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
        return EmailCampaignForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EmailCampaignsTable::configure($table);
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
            'index' => ListEmailCampaigns::route('/'),
            'create' => CreateEmailCampaign::route('/create'),
            'edit' => EditEmailCampaign::route('/{record}/edit'),
        ];
    }
    
    public static function getEditHeaderActions(): array
    {
        return [
            \Filament\Actions\Action::make('preview')
                ->label('Preview Campaign')
                ->icon('heroicon-o-eye')
                ->color('gray')
                ->modalHeading('Campaign Preview')
                ->modalWidth('3xl')
                ->form([
                    \Filament\Forms\Components\Select::make('demo_user')
                        ->label('Preview as User')
                        ->options(function ($record) {
                            $segmentService = new \App\Services\EmailSegmentationService();
                            $recipients = $segmentService->getRecipients($record->target_segment);
                            
                            return $recipients->take(10)->mapWithKeys(function ($user) {
                                $email = $user->email ?? $user['email'] ?? 'unknown';
                                $name = $user->name ?? $user['name'] ?? 'Unknown';
                                return [$email => "$name ($email)"];
                            });
                        })
                        ->required()
                        ->helperText('Select a user from the target segment to preview the email'),
                ])
                ->modalContent(function ($record, array $data) {
                    if (empty($data['demo_user'])) {
                        return null;
                    }
                    
                    $content = $record->html_content ?? $record->template?->html_content ?? '';
                    $variables = [
                        'customer_name' => explode('(', $data['demo_user'])[0] ?? 'Customer',
                        'shop_url' => config('app.url') . '/products',
                        'sale_url' => config('app.url') . '/products',
                        'vip_url' => config('app.url') . '/products',
                        'review_url' => config('app.url') . '/account/orders',
                        'recommendations_url' => config('app.url') . '/products',
                        'unsubscribe_url' => config('app.url') . '/unsubscribe/demo-token',
                    ];
                    
                    foreach ($variables as $key => $value) {
                        $content = str_replace('{{' . $key . '}}', $value, $content);
                    }
                    
                    return view('filament.email-preview', ['content' => $content]);
                })
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
                        ->helperText('Enter the email address to send a test campaign email'),
                ])
                ->action(function ($record, array $data) {
                    try {
                        $content = $record->html_content ?? $record->template?->html_content ?? '';
                        $variables = [
                            'customer_name' => 'Test User',
                            'shop_url' => config('app.url') . '/products',
                            'sale_url' => config('app.url') . '/products',
                            'vip_url' => config('app.url') . '/products',
                            'review_url' => config('app.url') . '/account/orders',
                            'recommendations_url' => config('app.url') . '/products',
                            'unsubscribe_url' => config('app.url') . '/unsubscribe/demo-token',
                        ];
                        
                        \Mail::to($data['test_email'])->send(
                            new \App\Mail\TestEmail(
                                subject: $record->subject,
                                htmlContent: $content,
                                variables: $variables
                            )
                        );
                        
                        \Filament\Notifications\Notification::make()
                            ->title('Test campaign sent successfully!')
                            ->success()
                            ->body("Email sent to {$data['test_email']}")
                            ->send();
                    } catch (\Exception $e) {
                        \Filament\Notifications\Notification::make()
                            ->title('Failed to send test campaign')
                            ->danger()
                            ->body($e->getMessage())
                            ->send();
                    }
                }),
        ];
    }
}
