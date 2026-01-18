<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Filament\Resources\Orders\Schemas\OrderInfolist;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Schemas\Schema;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function resolveRecord($key): \Illuminate\Database\Eloquent\Model
    {
        return static::getResource()::resolveRecordRouteBinding($key)
            ->load([
                'user',
                'orderItems.product.category',
                'invoices',
                'shipments',
                'refunds',
                'payments',
                'statusHistory.changedBy',
                'activities.user',
                'notes.user',
            ]);
    }

    public function infolist(Schema $schema): Schema
    {
        return OrderInfolist::configure($schema);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('generateInvoice')
                ->label('Generate Invoice')
                ->icon('heroicon-o-document-plus')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn ($record) => $record->invoices->isEmpty() && $record->status !== 'cancelled')
                ->action(function ($record) {
                    $invoice = \App\Models\Invoice::create([
                        'order_id' => $record->id,
                        // Use Order # as base if available, otherwise fallback
                        'invoice_number' => 'INV-' . ($record->order_number ?? $record->id),
                        'status' => 'paid',
                        'subtotal' => $record->subtotal ?? 0,
                        'tax' => 0, // Order model doesn't have tax column, default to 0 for now
                        'discount' => $record->discount ?? 0,
                        'total' => $record->total ?? 0,
                        'issued_at' => now(),
                    ]);

                    // Create Invoice Items from Order Items
                    foreach ($record->orderItems as $item) {
                        \App\Models\InvoiceItem::create([
                            'invoice_id' => $invoice->id,
                            'product_name' => $item->product->name ?? 'N/A',
                            'sku' => $item->product->sku ?? 'N/A',
                            'price' => $item->price,
                            'quantity' => $item->quantity,
                            'total' => $item->total,
                        ]);
                    }

                    // Log activity
                    \App\Models\OrderActivity::log(
                        $record->id,
                        'invoice_generated',
                        'Invoice #' . $invoice->id . ' generated',
                        null,
                        'invoiced'
                    );

                    \Filament\Notifications\Notification::make()
                        ->title('Invoice generated successfully')
                        ->success()
                        ->send();
                }),

            Actions\Action::make('createShipment')
                ->label('Create Shipment')
                ->icon('heroicon-o-truck')
                ->color('info')
                ->visible(fn ($record) => $record->status !== 'cancelled')
                ->form([
                    \Filament\Forms\Components\TextInput::make('courier_name')
                        ->label('Courier / Carrier')
                        ->required(),
                    \Filament\Forms\Components\TextInput::make('tracking_number')
                        ->label('Tracking Number')
                        ->required(),
                    \Filament\Forms\Components\TextInput::make('tracking_url')
                        ->label('Tracking URL')
                        ->url()
                        ->suffixIcon('heroicon-m-globe-alt'),
                ])
                ->action(function (array $data, $record) {
                    \App\Models\Shipment::create([
                        'order_id' => $record->id,
                        'courier_name' => $data['courier_name'],
                        'tracking_number' => $data['tracking_number'],
                        'tracking_url' => $data['tracking_url'],
                        'shipment_status' => 'shipped',
                        'shipped_at' => now(),
                    ]);

                    // Update order status if not already shipped/delivered/completed
                    if (!in_array($record->status, ['shipped', 'delivered', 'completed'])) {
                        $oldStatus = $record->status;
                        $record->update(['status' => 'shipped']);
                        
                        // Log status change
                        \App\Models\OrderStatusHistory::create([
                            'order_id' => $record->id,
                            'old_status' => $oldStatus,
                            'new_status' => 'shipped',
                            'changed_by' => auth()->id(),
                            'note' => 'Auto-updated by shipment creation',
                        ]);
                    }

                    // Log activity
                    \App\Models\OrderActivity::log(
                        $record->id,
                        'shipment_created',
                        'Shipment created via ' . $data['courier_name'] . ' (' . $data['tracking_number'] . ')',
                        null,
                        'shipped'
                    );

                    \Filament\Notifications\Notification::make()
                        ->title('Shipment created successfully')
                        ->success()
                        ->send();
                }),

            Actions\Action::make('refund')
                ->label('Initiate Refund')
                ->icon('heroicon-o-banknotes')
                ->color('danger')
                ->visible(fn ($record) => in_array($record->payment_status, ['paid', 'partially_refunded']) && $record->total > $record->refunds()->sum('amount'))
                ->form([
                    \Filament\Forms\Components\TextInput::make('amount')
                        ->label('Refund Amount')
                        ->numeric()
                        ->prefix('₹')
                        ->required()
                        ->maxValue(fn ($record) => $record->total - $record->refunds()->sum('amount')),
                    \Filament\Forms\Components\Select::make('gateway')
                        ->label('Refund Method')
                        ->options([
                            'offline' => 'Offline / Manual',
                            'razorpay' => 'Razorpay (Manual Record)',
                        ])
                        ->default('offline')
                        ->required(),
                    \Filament\Forms\Components\Textarea::make('reason')
                        ->label('Reason for Refund')
                        ->required(),
                ])
                ->action(function (array $data, $record) {
                    // Create Refund Record
                    \App\Models\Refund::create([
                        'order_id' => $record->id,
                        'invoice_id' => $record->invoices->first()?->id, // Link to first invoice if exists
                        'amount' => $data['amount'],
                        'reason' => $data['reason'],
                        'status' => 'completed', // Assuming manual refund is done immediately
                        'gateway' => $data['gateway'],
                        'processed_at' => now(),
                    ]);

                    // Update Order Payment Status
                    $refundedTotal = $record->refunds()->sum('amount') + $data['amount'];
                    $newStatus = ($refundedTotal >= $record->total) ? 'refunded' : 'partially_refunded';
                    
                    if ($record->payment_status !== $newStatus) {
                        $record->update(['payment_status' => $newStatus]);
                    }

                    // Log activity
                    \App\Models\OrderActivity::log(
                        $record->id,
                        'refund_processed',
                        'Refund of ₹' . $data['amount'] . ' processed via ' . $data['gateway'],
                        null,
                        $newStatus
                    );

                    \Filament\Notifications\Notification::make()
                        ->title('Refund initiated successfully')
                        ->success()
                        ->send();
                }),

            Actions\Action::make('changeStatus')
                ->label('Change Status')
                ->icon('heroicon-o-arrow-path')
                ->form([
                    \Filament\Forms\Components\Select::make('status')
                        ->label('Order Status')
                        ->options([
                            'pending' => 'Pending',
                            'processing' => 'Processing',
                            'shipped' => 'Shipped',
                            'delivered' => 'Delivered',
                            'completed' => 'Completed',
                            'cancelled' => 'Cancelled',
                        ])
                        ->required()
                        ->default(fn ($record) => $record->status),
                    \Filament\Forms\Components\Textarea::make('note')
                        ->label('Note (Optional)')
                        ->rows(2),
                ])
                ->action(function (array $data, $record) {
                    $oldStatus = $record->status;
                    $record->update(['status' => $data['status']]);
                    
                    // Log status change in status history
                    \App\Models\OrderStatusHistory::create([
                        'order_id' => $record->id,
                        'old_status' => $oldStatus,
                        'new_status' => $data['status'],
                        'changed_by' => auth()->id(),
                        'note' => $data['note'] ?? 'Status changed from ' . $oldStatus . ' to ' . $data['status'],
                    ]);
                    
                    // Log activity
                    \App\Models\OrderActivity::log(
                        $record->id,
                        'status_change',
                        'Order status changed from ' . ucfirst($oldStatus) . ' to ' . ucfirst($data['status']),
                        $oldStatus,
                        $data['status']
                    );
                    
                    \Filament\Notifications\Notification::make()
                        ->title('Order status updated')
                        ->success()
                        ->send();
                }),

            Actions\Action::make('print')
                ->label('Print Order')
                ->icon('heroicon-o-printer')
                ->url(fn ($record) => route('orders.print', $record))
                ->openUrlInNewTab(),

            Actions\Action::make('exportPdf')
                ->label('Export PDF')
                ->icon('heroicon-o-document-arrow-down')
                ->url(fn ($record) => route('orders.pdf', $record)),

            Actions\Action::make('exportCsv')
                ->label('Export CSV')
                ->icon('heroicon-o-table-cells')
                ->url(fn ($record) => route('orders.csv', $record)),

            Actions\DeleteAction::make()
                ->visible(fn ($record) => $record->status === 'cancelled'),
        ];
    }

}
