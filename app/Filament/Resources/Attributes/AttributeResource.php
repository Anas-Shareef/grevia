<?php

namespace App\Filament\Resources\Attributes;

use App\Filament\Resources\Attributes\Pages;
use App\Models\Attribute;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;

class AttributeResource extends Resource
{
    protected static ?string $model = Attribute::class;

    protected static string|\UnitEnum|null $navigationGroup = 'Catalog';

    protected static ?string $navigationLabel = 'Attributes';

    protected static ?int $navigationSort = 3;

    public static function shouldRegisterNavigation(): bool
    {
        return \Illuminate\Support\Facades\Schema::hasTable('attributes');
    }

    public static function canViewAny(): bool
    {
        return \Illuminate\Support\Facades\Schema::hasTable('attributes');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Attribute Configuration')
                    ->columns(2)
                    ->components([
                        TextInput::make('name')
                            ->required()
                            ->unique(ignoreRecord: true),
                        TextInput::make('label')
                            ->required(),
                        Select::make('display_type')
                            ->options([
                                'text_label' => 'Text Label',
                                'icon_text' => 'Icon + Text',
                                'range_slider' => 'Range Slider',
                            ])
                            ->default('text_label')
                            ->required(),
                        Select::make('filter_type')
                            ->options([
                                'single_select' => 'Sidebar — Single Select',
                                'multi_select' => 'Sidebar — Multi Select',
                                'not_filtered' => 'Not Filtered',
                            ])
                            ->default('single_select')
                            ->required(),
                        TextInput::make('sort_order')
                            ->numeric()
                            ->default(0),
                        Toggle::make('is_required')
                            ->default(false),
                    ]),
                Section::make('Attribute Values')
                    ->components([
                        Repeater::make('values')
                            ->relationship('values')
                            ->schema([
                                TextInput::make('value_text')
                                    ->required(),
                                TextInput::make('slug')
                                    ->required(),
                                FileUpload::make('icon_url')
                                    ->label('Icon (Trust Badges)')
                                    ->image()
                                    ->disk('public')
                                    ->directory('attributes/icons')
                                    ->helperText('Required for Icon + Text display type.'),
                                TextInput::make('sort_order')
                                    ->numeric()
                                    ->default(0),
                            ])
                            ->columns(2)
                            ->addActionLabel('Add Value')
                            ->defaultItems(0)
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->sortable()->searchable(),
                TextColumn::make('label')->sortable()->searchable(),
                TextColumn::make('display_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'text_label' => 'Text Label',
                        'icon_text' => 'Icon + Text',
                        'range_slider' => 'Range Slider',
                        default => $state
                    }),
                TextColumn::make('filter_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'single_select' => 'Single Select',
                        'multi_select' => 'Multi Select',
                        'not_filtered' => 'Not Filtered',
                        default => $state
                    }),
                TextColumn::make('values_count')
                    ->label('Value Count')
                    ->counts('values'),
            ])
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make()
                    ->before(function ($record, $action) {
                        $usageCount = \DB::table('product_attribute_value')->whereIn('value_id', $record->values->pluck('id'))->count();
                        if ($usageCount > 0) {
                            \Filament\Notifications\Notification::make()
                                ->title('Cannot Delete Attribute')
                                ->body("This attribute is assigned to {$usageCount} products. Unassign it first.")
                                ->danger()
                                ->send();
                            $action->cancel();
                        }
                    })
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAttributes::route('/'),
            'create' => Pages\CreateAttribute::route('/create'),
            'edit' => Pages\EditAttribute::route('/{record}/edit'),
        ];
    }
}
