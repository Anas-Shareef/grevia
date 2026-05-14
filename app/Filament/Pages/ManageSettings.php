<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Textarea;
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

                        Tabs\Tab::make('Logistics')
                            ->icon('heroicon-o-truck')
                            ->schema([
                                Grid::make(2)
                                    ->components([
                                        TextInput::make('free_shipping_threshold')
                                            ->label('Free Shipping Above (₹)')
                                            ->numeric()
                                            ->prefix('₹')
                                            ->required(),
                                        TextInput::make('flat_shipping_rate')
                                            ->label('Flat Shipping Rate (₹)')
                                            ->numeric()
                                            ->prefix('₹')
                                            ->required(),
                                        TextInput::make('estimated_delivery_days')
                                            ->label('Est. Delivery (e.g. 3-5 days)')
                                            ->placeholder('3-5 days'),
                                    ]),
                            ]),

                        Tabs\Tab::make('Payments')
                            ->icon('heroicon-o-credit-card')
                            ->schema([
                                Grid::make(2)
                                    ->components([
                                        Toggle::make('razorpay_enabled')
                                            ->label('Enable Razorpay'),
                                        Toggle::make('cod_enabled')
                                            ->label('Enable COD'),
                                    ]),
                                Section::make('Razorpay Configuration')
                                    ->components([
                                        TextInput::make('razorpay_key_id')
                                            ->label('Key ID')
                                            ->password()
                                            ->revealable(),
                                        TextInput::make('razorpay_key_secret')
                                            ->label('Key Secret')
                                            ->password()
                                            ->revealable(),
                                    ])
                                    ->collapsible(),
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
