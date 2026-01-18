<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductReviewResource\Pages;
use App\Filament\Resources\Products\ProductResource;
use App\Models\ProductReview;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ProductReviewResource extends Resource
{
    protected static ?string $model = ProductReview::class;

    // Icon removed - parent group 'Customers' has icon
    // protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-star';

    protected static string | \UnitEnum | null $navigationGroup = 'Customers';
    
    protected static ?int $navigationSort = 2;
    
    protected static ?string $navigationLabel = 'Reviews';

    public static function getNavigationBadge(): ?string
    {
        $count = \App\Services\NavigationBadgeService::getCustomerActivityCount();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

    public static function getNavigationBadgeTooltip(): ?string
    {
        return 'New customer activity requiring attention';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Group::make()
                    ->columns(3)
                    ->components([
                        // Left Column: Read-Only Info
                        \Filament\Schemas\Components\Section::make('Review Details')
                            ->columnSpan(1)
                            ->components([
                                Forms\Components\Placeholder::make('id')
                                    ->label('ID')
                                    ->content(fn ($record) => $record?->id),
                                
                                Forms\Components\Placeholder::make('created_at')
                                    ->label('Date')
                                    ->content(fn ($record) => $record?->created_at->format('Y-m-d')),

                                Forms\Components\Placeholder::make('product_name')
                                    ->label('Product')
                                    ->content(fn ($record) => $record?->product->name),

                                Forms\Components\Placeholder::make('customer_info')
                                    ->label('Customer')
                                    ->content(fn ($record) => $record?->user ? $record->user->name : ($record->guest_name . ' (Guest)')),
                            ]),

                        // Right Column: Editable Fields
                        \Filament\Schemas\Components\Section::make('Content')
                            ->columnSpan(2)
                            ->components([
                                \Filament\Schemas\Components\Group::make()
                                    ->columns(2)
                                    ->components([
                                        Forms\Components\Select::make('status')
                                            ->options([
                                                'pending' => 'Pending',
                                                'approved' => 'Approved',
                                                'rejected' => 'Rejected',
                                            ])
                                            ->required()
                                            ->native(false),

                                        Forms\Components\TextInput::make('rating')
                                            ->label('Rating (1-5)')
                                            ->numeric()
                                            ->minValue(1)
                                            ->maxValue(5)
                                            ->required(),
                                    ]),

                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->columnSpanFull(),

                                Forms\Components\Textarea::make('comment')
                                    ->rows(5)
                                    ->required()
                                    ->columnSpanFull(),
                                
                                // Images (Read Only Grid of Images)
                                \Filament\Schemas\Components\Section::make('Images')
                                    ->components([
                                        Forms\Components\ViewField::make('images')
                                            ->view('filament.forms.components.review-images')
                                            ->hidden(fn ($record) => $record && $record->images->isEmpty())                                    
                                    ])
                            ]),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Product')
                    ->description(fn (ProductReview $record) => 'ID: ' . $record->product_id)
                    ->searchable()
                    ->sortable()
                    ->url(fn (ProductReview $record) => ProductResource::getUrl('edit', ['record' => $record->product_id]))
                    ->color('primary')
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('customer')
                    ->label('Customer')
                    ->state(fn (ProductReview $record) => $record->user ? $record->user->name : $record->guest_name)
                    ->description(fn (ProductReview $record) => $record->user ? $record->user->email : $record->guest_email)
                    ->badge(fn (ProductReview $record) => !$record->user)
                    ->color(fn (ProductReview $record) => !$record->user ? 'warning' : null)
                    ->formatStateUsing(fn ($state, ProductReview $record) => $state . ($record->user ? '' : ' (Guest)'))
                    ->searchable(['guest_name', 'guest_email', 'user.name', 'user.email']),

                Tables\Columns\TextColumn::make('rating')
                    ->sortable()
                    ->formatStateUsing(fn (string $state): string => $state . ' ★')
                    ->color('warning'),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->limit(30)
                    ->tooltip(fn (ProductReview $record) => $record->title),

                Tables\Columns\TextColumn::make('comment')
                    ->limit(50)
                    ->searchable()
                    ->tooltip(fn (ProductReview $record) => $record->comment),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ]),

                Tables\Columns\IconColumn::make('is_verified_purchase')
                    ->label('Verified')
                    ->boolean()
                    ->sortable()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('gray'),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),
                Tables\Filters\Filter::make('guest_only')
                    ->query(fn (Builder $query) => $query->whereNull('user_id'))
                    ->label('Guest Reviews Only'),
                Tables\Filters\Filter::make('verified_only')
                    ->query(fn (Builder $query) => $query->where('is_verified_purchase', true))
                    ->label('Verified Purchases Only'),
            ])
            ->recordActions([
                Action::make('approve')
                    ->action(fn (ProductReview $record) => $record->update(['status' => 'approved']))
                    ->requiresConfirmation()
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->label('Approve')
                    ->hidden(fn (ProductReview $record) => $record->status === 'approved'),

                Action::make('reject')
                    ->action(fn (ProductReview $record) => $record->update(['status' => 'rejected']))
                    ->requiresConfirmation()
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->label('Reject')
                    ->hidden(fn (ProductReview $record) => $record->status === 'rejected'),
            ])
            ->toolbarActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\BulkAction::make('approve_selected')
                        ->action(fn ($records) => $records->each->update(['status' => 'approved']))
                        ->icon('heroicon-o-check')
                        ->color('success'),
                    \Filament\Actions\BulkAction::make('reject_selected')
                        ->action(fn ($records) => $records->each->update(['status' => 'rejected']))
                        ->icon('heroicon-o-x-mark')
                        ->color('danger'),
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListProductReviews::route('/'),
            // 'create' => Pages\CreateProductReview::route('/create'), // Removed to force modal if needed? No, just keep index.
            // Keeping index only forces Action Edit to be modal if we remove 'edit' page.
            // 'edit' => Pages\EditProductReview::route('/{record}/edit'), 
        ];
    }
    
    // Ensure getEloquentQuery uses the ProductReview model
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery();
    }
}
