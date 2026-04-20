<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Filament\Tables\Actions\BulkAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Category;
use Illuminate\Database\Eloquent\Model;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('image_url')
                    ->label('Thumbnail')
                    ->state(function (Model $record): string {
                        $url = $record->image_url ?: 'https://placehold.co/100x100/e2e8f0/64748b?text=No+Img';
                        return '<img src="' . $url . '" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" class="shadow-sm border border-gray-200" alt="Thumbnail">';
                    })
                    ->html(),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->wrap(),
                TextColumn::make('category.name')
                    ->sortable(),
                TextColumn::make('price')
                    ->money('INR')
                    ->sortable(),
                TextColumn::make('rating')
                    ->numeric(1)
                    ->sortable(),
                IconColumn::make('in_stock')
                    ->boolean()
                    ->sortable(),
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                Action::make('export_excel')
                    ->label('Export Excel')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('success')
                    ->url(fn () => route('admin.export.products'))
                    ->openUrlInNewTab(),
                BulkActionGroup::make([
                    BulkAction::make('assign_category')
                        ->label('Assign Category')
                        ->icon('heroicon-o-folder-open')
                        ->form([
                            Select::make('category_id')
                                ->label('Target Category')
                                ->options(Category::query()->pluck('name', 'id'))
                                ->required(),
                        ])
                        ->action(function (Collection $records, array $data): void {
                            foreach ($records as $record) {
                                $record->update(['category_id' => $data['category_id']]);
                            }
                        })
                        ->deselectRecordsAfterCompletion(),
                        
                    BulkAction::make('add_tags')
                        ->label('Add Tags')
                        ->icon('heroicon-o-tag')
                        ->form([
                            TagsInput::make('tags')
                                ->label('Tags to Append')
                                ->required(),
                        ])
                        ->action(function (Collection $records, array $data): void {
                            foreach ($records as $record) {
                                $existingTags = $record->tags ?? [];
                                $newTags = array_unique(array_merge($existingTags, $data['tags']));
                                $record->update(['tags' => $newTags]);
                            }
                        })
                        ->deselectRecordsAfterCompletion(),

                    BulkAction::make('set_discount')
                        ->label('Set Discount (%)')
                        ->icon('heroicon-o-receipt-percent')
                        ->form([
                            TextInput::make('discount_percentage')
                                ->label('Discount Percentage')
                                ->numeric()
                                ->required()
                                ->minValue(0)
                                ->maxValue(100),
                        ])
                        ->action(function (Collection $records, array $data): void {
                            $discount = (float) $data['discount_percentage'];
                            foreach ($records as $record) {
                                // If base price is identical to true base, move it to historic so it slashes correctly
                                $basePrice = $record->original_price ?: $record->price;
                                $newPrice = $basePrice - ($basePrice * ($discount / 100));
                                
                                $record->update([
                                    'original_price' => $basePrice,
                                    'price' => $newPrice
                                ]);
                            }
                        })
                        ->deselectRecordsAfterCompletion(),
                        
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
