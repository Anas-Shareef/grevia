<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditOrder extends EditRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\Action::make('update_status')
                ->label('Update Status')
                ->icon('heroicon-o-arrow-path')
                ->form([
                    \Filament\Forms\Components\Select::make('status')
                        ->label('New Status')
                        ->options(function ($record) {
                            $current = $record->status;
                            $transitions = [
                                'pending' => ['processing' => 'Processing', 'cancelled' => 'Cancelled'],
                                'processing' => ['shipped' => 'Shipped', 'cancelled' => 'Cancelled'],
                                'shipped' => ['delivered' => 'Delivered', 'cancelled' => 'Cancelled'],
                                'delivered' => ['completed' => 'Completed'],
                                'completed' => ['refunded' => 'Refunded'],
                                'cancelled' => [],
                                'refunded' => [],
                            ];
                            return $transitions[$current] ?? [];
                        })
                        ->required(),
                    \Filament\Forms\Components\Textarea::make('note')
                        ->label('Note')
                        ->rows(2),
                ])
                ->action(function (array $data, $record) {
                    $service = new \App\Services\OrderStatusService();
                    try {
                        $service->updateStatus($record, $data['status'], $data['note']);
                        \Filament\Notifications\Notification::make()
                            ->title('Status updated successfully')
                            ->success()
                            ->send();
                    } catch (\Exception $e) {
                        \Filament\Notifications\Notification::make()
                            ->title('Update failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),
            \Filament\Actions\Action::make('generate_invoice')
                ->label('Generate Invoice')
                ->icon('heroicon-o-document-text')
                ->requiresConfirmation()
                ->action(function ($record) {
                    $service = new \App\Services\InvoiceService();
                    try {
                        $service->generateInvoice($record);
                        \Filament\Notifications\Notification::make()
                            ->title('Invoice generated successfully')
                            ->success()
                            ->send();
                    } catch (\Exception $e) {
                         \Filament\Notifications\Notification::make()
                            ->title('Generation failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),
            \Filament\Actions\Action::make('ship_order')
                ->label('Ship Order')
                ->icon('heroicon-o-truck')
                ->form([
                    \Filament\Forms\Components\TextInput::make('courier_name')
                        ->required()
                        ->label('Courier Name'),
                    \Filament\Forms\Components\TextInput::make('tracking_number')
                        ->required()
                        ->label('Tracking Number'),
                    \Filament\Forms\Components\TextInput::make('tracking_url')
                        ->label('Tracking URL')
                        ->url(),
                ])
                ->action(function ($record, array $data) {
                    $service = new \App\Services\ShipmentService();
                    try {
                        $service->shipOrder($record, $data);
                        \Filament\Notifications\Notification::make()
                            ->title('Order Shipped')
                            ->success()
                            ->send();
                    } catch (\Exception $e) {
                         \Filament\Notifications\Notification::make()
                            ->title('Shipment failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                })
                ->visible(fn ($record) => $record->status === 'processing'),
            \Filament\Actions\Action::make('refund_order')
                ->label('Refund')
                ->icon('heroicon-o-arrow-path-rounded-square')
                ->color('danger')
                ->form([
                    \Filament\Forms\Components\Select::make('invoice_id')
                        ->label('Invoice')
                        ->options(fn ($record) => $record->invoices->pluck('invoice_number', 'id')->filter()->toArray())
                        ->required()
                        ->reactive()
                        ->afterStateUpdated(function ($state, callable $set) {
                           // Ideally fetch max refundable amount here if feasible
                        }),
                    \Filament\Forms\Components\TextInput::make('amount')
                        ->label('Refund Amount')
                        ->numeric()
                        ->required()
                        ->helperText('Cannot exceed remaining invoice amount'),
                    \Filament\Forms\Components\Textarea::make('reason')
                        ->required(),
                ])
                ->action(function ($record, array $data) {
                    $service = new \App\Services\RefundService();
                    try {
                        $service->createRefund($record, $data);
                        \Filament\Notifications\Notification::make()
                            ->title('Refund processed successfully')
                            ->success()
                            ->send();
                    } catch (\Exception $e) {
                         \Filament\Notifications\Notification::make()
                            ->title('Refund failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
