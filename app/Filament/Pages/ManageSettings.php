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

    private array $expectedKeys = [
        'store_name',
        'store_email',
        'store_phone',
        'support_phone',
        'store_address',
        'homepage_title',
        'homepage_description',
        'instagram_url',
        'facebook_url',
        'google_analytics_id',
        'policy_privacy_content',
        'policy_privacy_meta_title',
        'policy_privacy_meta_description',
        'policy_terms_content',
        'policy_terms_meta_title',
        'policy_terms_meta_description',
        'policy_refund_content',
        'policy_refund_meta_title',
        'policy_refund_meta_description',
        'policy_shipping_content',
        'policy_shipping_meta_title',
        'policy_shipping_meta_description',
    ];

    public function mount(): void
    {
        $settings = SiteSetting::all()->pluck('value', 'key')->toArray();

        // Automatic migration/fallback from return policy to refund policy if empty
        if (empty($settings['policy_refund_content']) && !empty($settings['policy_return_content'])) {
            $settings['policy_refund_content'] = $settings['policy_return_content'];
        }
        if (empty($settings['policy_refund_meta_title']) && !empty($settings['policy_return_meta_title'])) {
            $settings['policy_refund_meta_title'] = $settings['policy_return_meta_title'];
        }
        if (empty($settings['policy_refund_meta_description']) && !empty($settings['policy_return_meta_description'])) {
            $settings['policy_refund_meta_description'] = $settings['policy_return_meta_description'];
        }

        foreach ($this->expectedKeys as $key) {
            if (!array_key_exists($key, $settings)) {
                $settings[$key] = '';
            }
        }

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
                                        Tabs\Tab::make('Refund Policy')
                                            ->schema([
                                                RichEditor::make('policy_refund_content')
                                                    ->label('Refund Policy Content'),
                                                TextInput::make('policy_refund_meta_title')
                                                    ->label('SEO Meta Title')
                                                    ->placeholder('Refund Policy | Grevia'),
                                                Textarea::make('policy_refund_meta_description')
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
            // Only save expected settings keys to prevent saving container/layout component states
            if (!in_array($key, $this->expectedKeys)) {
                continue;
            }

            // If the value is a JSON string representing a ProseMirror document, decode it
            if (is_string($value) && str_starts_with(trim($value), '{"type":"doc"')) {
                $decoded = json_decode($value, true);
                if (is_array($decoded)) {
                    $value = $decoded;
                }
            }

            // Convert ProseMirror/TipTap array structure to HTML
            if (is_array($value) && isset($value['type']) && $value['type'] === 'doc') {
                $value = $this->proseMirrorToHtml($value);
            }

            // Handle fallback for other array values
            if (is_array($value)) {
                if (isset($value['html'])) {
                    $value = $value['html'];
                } elseif (isset($value['value'])) {
                    $value = $value['value'];
                } else {
                    $value = json_encode($value);
                }
            }

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

    private function proseMirrorToHtml(array $node): string
    {
        $type = $node['type'] ?? '';
        $content = $node['content'] ?? [];
        $text = $node['text'] ?? '';
        $attrs = $node['attrs'] ?? [];
        $marks = $node['marks'] ?? [];

        // Recurse child nodes
        $htmlContent = '';
        foreach ($content as $child) {
            if (is_array($child)) {
                $htmlContent .= $this->proseMirrorToHtml($child);
            }
        }

        switch ($type) {
            case 'doc':
                return $htmlContent;
            case 'paragraph':
                $align = isset($attrs['textAlign']) ? " style=\"text-align: {$attrs['textAlign']}\"" : '';
                return "<p{$align}>{$htmlContent}</p>";
            case 'heading':
                $level = $attrs['level'] ?? 1;
                return "<h{$level}>{$htmlContent}</h{$level}>";
            case 'text':
                $result = htmlspecialchars($text);
                foreach ($marks as $mark) {
                    $markType = $mark['type'] ?? '';
                    $markAttrs = $mark['attrs'] ?? [];
                    if ($markType === 'bold') {
                        $result = "<strong>{$result}</strong>";
                    } elseif ($markType === 'italic') {
                        $result = "<em>{$result}</em>";
                    } elseif ($markType === 'underline') {
                        $result = "<u>{$result}</u>";
                    } elseif ($markType === 'strike') {
                        $result = "<s>{$result}</s>";
                    } elseif ($markType === 'link') {
                        $href = htmlspecialchars($markAttrs['href'] ?? '');
                        $target = isset($markAttrs['target']) ? " target=\"{$markAttrs['target']}\"" : '';
                        $result = "<a href=\"{$href}\"{$target}>{$result}</a>";
                    }
                }
                return $result;
            case 'bulletList':
            case 'bullet_list':
                return "<ul>{$htmlContent}</ul>";
            case 'orderedList':
            case 'ordered_list':
                return "<ol>{$htmlContent}</ol>";
            case 'listItem':
            case 'list_item':
                return "<li>{$htmlContent}</li>";
            case 'blockquote':
                return "<blockquote>{$htmlContent}</blockquote>";
            case 'hardBreak':
            case 'hard_break':
                return "<br />";
            case 'horizontalRule':
            case 'horizontal_rule':
                return "<hr />";
            default:
                return $htmlContent ?: htmlspecialchars($text);
        }
    }
}
