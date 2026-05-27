<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\RichEditor;
use Filament\Pages\Page;
use Filament\Notifications\Notification;
use Filament\Schemas\Schema;

class ManageSettings extends Page
{
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected string $view = 'filament.pages.manage-settings';

    protected static \UnitEnum|string|null $navigationGroup = 'Administration';

    protected static ?string $title = 'Site Settings';

    public ?array $data = [];

    public function mount(): void
    {
        $settings = SiteSetting::all()->pluck('value', 'key')->toArray();
        $this->data = $settings;
    }

    public function schema(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Settings')
                    ->tabs([
                        Tabs\Tab::make('General')
                            ->icon('heroicon-o-home')
                            ->schema([
                                Grid::make(2)
                                    ->components([
                                        TextInput::make('store_name')
                                            ->label('Store Name')
                                            ->required(),
                                        TextInput::make('store_email')
                                            ->label('Contact Email')
                                            ->email()
                                            ->required(),
                                        TextInput::make('store_phone')
                                            ->label('WhatsApp Number')
                                            ->tel()
                                            ->required(),
                                        TextInput::make('support_phone')
                                            ->label('Support Phone')
                                            ->tel(),
                                    ]),
                                Textarea::make('store_address')
                                    ->label('Office Address')
                                    ->rows(3),
                            ]),

                        Tabs\Tab::make('SEO & Social')
                            ->icon('heroicon-o-globe-alt')
                            ->schema([
                                TextInput::make('homepage_title')
                                    ->label('Homepage Meta Title'),
                                Textarea::make('homepage_description')
                                    ->label('Homepage Meta Description')
                                    ->rows(3),
                                Grid::make(2)
                                    ->components([
                                        TextInput::make('instagram_url')
                                            ->label('Instagram URL')
                                            ->url(),
                                        TextInput::make('facebook_url')
                                            ->label('Facebook URL')
                                            ->url(),
                                        TextInput::make('google_analytics_id')
                                            ->label('GA4 Measurement ID')
                                            ->placeholder('G-XXXXXXXXXX'),
                                    ]),
                            ]),

                        Tabs\Tab::make('Pages & Policies')
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Tabs::make('PolicyPages')
                                    ->tabs([
                                        Tabs\Tab::make('Privacy Policy')
                                            ->schema([
                                                RichEditor::make('policy_privacy_content')
                                                    ->label('Privacy Policy Content'),
                                                TextInput::make('policy_privacy_meta_title')
                                                    ->label('SEO Meta Title')
                                                    ->placeholder('Privacy Policy | Grevia'),
                                                Textarea::make('policy_privacy_meta_description')
                                                    ->label('SEO Meta Description')
                                                    ->rows(3),
                                            ]),
                                        Tabs\Tab::make('Terms & Conditions')
                                            ->schema([
                                                RichEditor::make('policy_terms_content')
                                                    ->label('Terms & Conditions Content'),
                                                TextInput::make('policy_terms_meta_title')
                                                    ->label('SEO Meta Title')
                                                    ->placeholder('Terms & Conditions | Grevia'),
                                                Textarea::make('policy_terms_meta_description')
                                                    ->label('SEO Meta Description')
                                                    ->rows(3),
                                            ]),
                                        Tabs\Tab::make('Return Policy')
                                            ->schema([
                                                RichEditor::make('policy_return_content')
                                                    ->label('Return Policy Content'),
                                                TextInput::make('policy_return_meta_title')
                                                    ->label('SEO Meta Title')
                                                    ->placeholder('Return Policy | Grevia'),
                                                Textarea::make('policy_return_meta_description')
                                                    ->label('SEO Meta Description')
                                                    ->rows(3),
                                            ]),
                                        Tabs\Tab::make('FAQ')
                                            ->schema([
                                                RichEditor::make('policy_faq_content')
                                                    ->label('Frequently Asked Questions Content'),
                                                TextInput::make('policy_faq_meta_title')
                                                    ->label('SEO Meta Title')
                                                    ->placeholder('FAQ | Grevia'),
                                                Textarea::make('policy_faq_meta_description')
                                                    ->label('SEO Meta Description')
                                                    ->rows(3),
                                            ]),
                                        Tabs\Tab::make('Shipping Policy')
                                            ->schema([
                                                RichEditor::make('policy_shipping_content')
                                                    ->label('Shipping Policy Content'),
                                                TextInput::make('policy_shipping_meta_title')
                                                    ->label('SEO Meta Title')
                                                    ->placeholder('Shipping Policy (India) | Grevia'),
                                                Textarea::make('policy_shipping_meta_description')
                                                    ->label('SEO Meta Description')
                                                    ->rows(3),
                                            ]),
                                    ])
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        foreach ($this->data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        Notification::make()
            ->title('Settings saved successfully')
            ->success()
            ->send();
    }
}
