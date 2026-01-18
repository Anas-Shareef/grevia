<?php

namespace App\Filament\Resources\ContactPages;

use App\Filament\Resources\ContactPages\Pages\CreateContactPage;
use App\Filament\Resources\ContactPages\Pages\EditContactPage;
use App\Filament\Resources\ContactPages\Pages\ListContactPages;
use App\Filament\Resources\ContactPages\Schemas\ContactPageForm;
use App\Filament\Resources\ContactPages\Tables\ContactPagesTable;
use App\Models\ContactPage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class ContactPageResource extends Resource
{
    protected static ?string $model = ContactPage::class;

    // Icon removed - parent group 'CMS' has icon
    // protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'CMS';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Contact';

    protected static ?string $recordTitleAttribute = 'page_title';

    public static function form(Schema $schema): Schema
    {
        return ContactPageForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ContactPagesTable::configure($table);
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
            'index' => ListContactPages::route('/'),
            'create' => CreateContactPage::route('/create'),
            'edit' => EditContactPage::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return ContactPage::count() === 0;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }
}
