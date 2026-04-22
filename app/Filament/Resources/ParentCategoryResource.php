<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ParentCategoryResource\Pages\CreateParentCategory;
use App\Filament\Resources\ParentCategoryResource\Pages\EditParentCategory;
use App\Filament\Resources\ParentCategoryResource\Pages\ListParentCategories;
use App\Filament\Resources\ParentCategoryResource\Tables\ParentCategoriesTable;
use App\Filament\Resources\Categories\Schemas\CategoryForm;
use App\Models\Category;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ParentCategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-squares-plus';

    protected static ?string $navigationLabel = 'Parent Categories';

    protected static ?string $pluralModelLabel = 'Parent Categories';

    protected static string|\UnitEnum|null $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return CategoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ParentCategoriesTable::configure($table);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where(fn ($q) => $q->whereNull('parent_id')->orWhere('parent_id', 0));
    }

    public static function getPages(): array
    {
        return [
            'index' => ListParentCategories::route('/'),
            'create' => CreateParentCategory::route('/create'),
            'edit' => EditParentCategory::route('/{record}/edit'),
        ];
    }
}
