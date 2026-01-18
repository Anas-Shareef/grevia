<?php

namespace App\Filament\Resources\FooterSections;

use App\Filament\Resources\FooterSections\Pages\CreateFooterSection;
use App\Filament\Resources\FooterSections\Pages\EditFooterSection;
use App\Filament\Resources\FooterSections\Pages\ListFooterSections;
use App\Filament\Resources\FooterSections\Schemas\FooterSectionForm;
use App\Filament\Resources\FooterSections\Tables\FooterSectionsTable;
use App\Models\FooterSection;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FooterSectionResource extends Resource
{
    protected static ?string $model = FooterSection::class;

    // Icon removed - parent group 'CMS' has icon
    // protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'CMS';

    protected static ?int $navigationSort = 4;

    protected static ?string $navigationLabel = 'Footer';

    protected static ?string $recordTitleAttribute = 'section_name';

    public static function form(Schema $schema): Schema
    {
        return FooterSectionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FooterSectionsTable::configure($table);
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
            'index' => ListFooterSections::route('/'),
            'create' => CreateFooterSection::route('/create'),
            'edit' => EditFooterSection::route('/{record}/edit'),
        ];
    }
}
