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
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Filament\Actions\BulkAction;
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
                // ── Thumbnail ───────────────────────────────────────────
                TextColumn::make('image_url')
                    ->label('Thumbnail')
                    ->state(function (Model $record): string {
                        if (empty($record->image_url)) {
                            return '<span style="background-color: #DC2626; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold;">No Image</span>';
                        }
                        return '<img src="' . $record->image_url . '" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" class="shadow-sm border border-gray-200" alt="Thumbnail">';
                    })
                    ->html(),

                // ── Product Name ─────────────────────────────────────────
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->wrap(),

                // ── Category ─────────────────────────────────────────────
                TextColumn::make('category.name')
                    ->sortable()
                    ->badge()
                    ->color('gray'),

                // ── Price ────────────────────────────────────────────────
                TextColumn::make('price')
                    ->money('INR')
                    ->sortable(),

                // ── Filter Attributes — Power the Collections sidebar ────
                TextColumn::make('format')
                    ->label('Format')
                    ->badge()
                    ->color(fn (?string $state): string => match($state) {
                        'powder'  => 'success',
                        'drops'   => 'info',
                        'tablets' => 'warning',
                        'liquid'  => 'info',
                        'jar'     => 'gray',
                        default   => 'gray',
                    })
                    ->formatStateUsing(fn (?string $state): string => $state ? ucfirst($state) : '—')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('concentration')
                    ->label('Concentration')
                    ->badge()
                    ->color('warning')
                    ->formatStateUsing(fn (?string $state): string => $state ?: '—')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('size_label')
                    ->label('Pack Size')
                    ->badge()
                    ->color('primary')
                    ->formatStateUsing(fn (?string $state): string => $state ?: '—')
                    ->toggleable(),

                // ── Status Columns ────────────────────────────────────────
                IconColumn::make('in_stock')
                    ->boolean()
                    ->sortable(),

                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('rating')
                    ->numeric(1)
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                // ── Filter by Category ────────────────────────────────────
                SelectFilter::make('category_id')
                    ->label('Category')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload(),

                // ── Filter by Format ──────────────────────────────────────
                SelectFilter::make('format')
                    ->label('Format')
                    ->options([
                        'powder'  => 'Powder',
                        'drops'   => 'Drops',
                        'tablets' => 'Tablets',
                        'liquid'  => 'Liquid',
                        'jar'     => 'Jar',
                    ]),

                // ── Filter by Concentration ──────────────────────────────
                SelectFilter::make('concentration')
                    ->label('Concentration')
                    ->options([
                        '1:10'  => '1:10 (High Potency)',
                        '1:50'  => '1:50 (Medium)',
                        '1:100' => '1:100 (Mild)',
                        '1:200' => '1:200 (Extra Mild)',
                    ]),

                TernaryFilter::make('has_image')
                    ->label('Image Status')
                    ->placeholder('All Products')
                    ->trueLabel('Has Image')
                    ->falseLabel('Missing Image')
                    ->queries(
                        true: fn ($query) => $query->whereNotNull('image_url')->where('image_url', '!=', ''),
                        false: fn ($query) => $query->where(function ($q) {
                            $q->whereNull('image_url')->orWhere('image_url', '');
                        }),
                        blank: fn ($query) => $query,
                    ),

                TrashedFilter::make(),
            ])
            ->filtersLayout(\Filament\Tables\Enums\FiltersLayout::AboveContent)
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
                    // ── NEW: Bulk-set filter attributes ──────────────────
                    BulkAction::make('set_filter_attributes')
                        ->label('Set Filter Attributes')
                        ->icon('heroicon-o-funnel')
                        ->color('primary')
                        ->form([
                            Select::make('format')
                                ->label('Product Format')
                                ->options([
                                    'powder'  => 'Powder',
                                    'drops'   => 'Drops',
                                    'tablets' => 'Tablets',
                                    'liquid'  => 'Liquid',
                                    'jar'     => 'Jar',
                                ])
                                ->placeholder('Leave blank to keep existing'),

                            Select::make('concentration')
                                ->label('Sweetener Concentration')
                                ->options([
                                    '1:10'  => '1:10 (High Potency)',
                                    '1:50'  => '1:50 (Medium)',
                                    '1:100' => '1:100 (Mild)',
                                    '1:200' => '1:200 (Extra Mild)',
                                ])
                                ->placeholder('Leave blank to keep existing'),

                            TagsInput::make('size_label')
                                ->label('Pack Size Tags')
                                ->helperText('Add sizes like 50g, 100g. Powers the sidebar filters.')
                                ->placeholder('Add size')
                                ->separator(','),
                        ])
                        ->action(function (Collection $records, array $data): void {
                            $updates = array_filter([
                                'format'     => $data['format'] ?? null,
                                'concentration' => $data['concentration'] ?? null,
                            ], fn ($v) => !is_null($v) && $v !== '');
                            
                            // Handle size_label specifically if provided
                            if (!empty($data['size_label'])) {
                                $updates['size_label'] = is_array($data['size_label']) 
                                    ? implode(',', $data['size_label']) 
                                    : $data['size_label'];
                            }

                            if (!empty($updates)) {
                                foreach ($records as $record) {
                                    $record->update($updates);
                                }
                            }
                        })
                        ->deselectRecordsAfterCompletion(),

                    // ── Existing bulk actions ─────────────────────────────
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
                                $basePrice = $record->original_price ?: $record->price;
                                $newPrice  = $basePrice - ($basePrice * ($discount / 100));
                                $record->update([
                                    'original_price' => $basePrice,
                                    'price'          => $newPrice,
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
