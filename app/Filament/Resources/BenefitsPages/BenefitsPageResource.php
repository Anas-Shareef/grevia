<?php

namespace App\Filament\Resources\BenefitsPages;

use App\Filament\Resources\BenefitsPages\Pages\CreateBenefitsPage;
use App\Filament\Resources\BenefitsPages\Pages\EditBenefitsPage;
use App\Filament\Resources\BenefitsPages\Pages\ListBenefitsPages;
use App\Filament\Resources\BenefitsPages\Schemas\BenefitsPageForm;
use App\Filament\Resources\BenefitsPages\Tables\BenefitsPagesTable;
use App\Models\BenefitsPage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BenefitsPageResource extends Resource
{
    protected static ?string $model = BenefitsPage::class;

    // Icon removed - parent group 'CMS' has icon
    // protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'CMS';

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationLabel = 'Benefits';

    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Schema $schema): Schema
    {
        return BenefitsPageForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BenefitsPagesTable::configure($table);
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
            'index' => ListBenefitsPages::route('/'),
            'create' => CreateBenefitsPage::route('/create'),
            'edit' => EditBenefitsPage::route('/{record}/edit'),
        ];
    }
}
