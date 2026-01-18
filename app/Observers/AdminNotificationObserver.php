<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\Payment; 
use App\Models\Refund;
use App\Models\SiteSetting;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminNotificationObserver
{
    /**
     * Handle the "created" event.
     */
    public function created($model): void
    {
        $recipients = User::all();

        // 🛒 ORDER-RELATED: Pending
        if ($model instanceof Order) {
            $this->sendRaw(
                Notification::make()
                    ->title('Order Pending')
                    ->body("Order #{$model->order_number} has been placed by the customer.")
                    ->icon('heroicon-o-shopping-bag')
                    ->warning()
                    ->actions([
                        Action::make('view')
                            ->button()
                            ->url(route('filament.admin.resources.orders.view', $model->id ?? 1)),
                    ]),
                $recipients
            );
        }
        
        // 👤 CUSTOMER-RELATED: New Customer
        elseif ($model instanceof User) {
            $this->sendRaw(
                Notification::make()
                    ->title('New Customer Registered')
                    ->body("A new customer has created an account.")
                    ->icon('heroicon-o-user-plus')
                    ->info()
                    ->actions([
                        Action::make('view')
                            ->button()
                            ->url(route('filament.admin.resources.users.index')),
                    ]),
                $recipients
            );
        }

        // 👤 CUSTOMER-RELATED: Review Submitted
        elseif ($model instanceof ProductReview) {
             $this->sendRaw(
                Notification::make()
                    ->title('Customer Review Submitted')
                    ->body("A product review is awaiting approval.")
                    ->icon('heroicon-o-star')
                    ->warning()
                    ->actions([
                        Action::make('view')
                            ->button()
                            ->url(route('filament.admin.resources.products.index')),
                    ]),
                $recipients
             );
        }

        // 💸 PAYMENT: Payment Received
        elseif ($model instanceof Payment) {
             if ($model->status === 'captured' || $model->status === 'success') {
                $this->sendRaw(
                    Notification::make()
                        ->title('Payment Received')
                        ->body("Payment for Order #{$model->order_id} was successful.")
                        ->icon('heroicon-o-currency-dollar')
                        ->success(),
                    $recipients
                );
             }
        }

        // 💸 REFUND: Refund Requested
        elseif ($model instanceof Refund) {
             $this->sendRaw(
                Notification::make()
                    ->title('Refund Requested')
                    ->body("A customer requested a refund for Order #{$model->order_id}.")
                    ->icon('heroicon-o-arrow-path')
                    ->warning(),
                $recipients
             );
        }
    }

    /**
     * Handle the "updated" event.
     */
    public function updated($model): void
    {
        $recipients = User::all();

        // 🛒 ORDER-RELATED: Status Updates
        if ($model instanceof Order && $model->isDirty('status')) {
            $status = $model->status;
            $notification = Notification::make()
                ->actions([
                    Action::make('view')
                        ->button()
                        ->url(route('filament.admin.resources.orders.view', $model->id)),
                ]);

            $shouldSend = true;

            switch ($status) {
                case 'processing':
                    $notification
                        ->title('Order Processing')
                        ->body('An order is now being processed.')
                        ->icon('heroicon-o-play-circle')
                        ->info();
                    break;
                case 'shipped':
                    $notification
                        ->title('Order Shipped')
                        ->body("Order #{$model->order_number} has been shipped.")
                        ->icon('heroicon-o-truck')
                        ->info();
                    break;
                case 'delivered':
                    $notification
                        ->title('Order Completed')
                        ->body("Order #{$model->order_number} has been successfully completed.")
                        ->icon('heroicon-o-check-circle')
                        ->success();
                    break;
                case 'completed': 
                     $notification
                        ->title('Order Completed')
                        ->body("Order #{$model->order_number} has been completed.")
                        ->icon('heroicon-o-check-circle')
                        ->success();
                    break;
                case 'cancelled':
                    $notification
                        ->title('Order Cancelled')
                        ->body("A customer or admin has cancelled Order #{$model->order_number}.")
                        ->icon('heroicon-o-x-circle')
                        ->danger();
                    break;
                default:
                    $shouldSend = false;
            }

            if ($shouldSend) {
                $this->sendRaw($notification, $recipients);
            }
        }

        // 📦 INVENTORY: Out of Stock
        elseif ($model instanceof Product && $model->isDirty('in_stock')) {
            if (!$model->in_stock) {
                 $this->sendRaw(
                    Notification::make()
                        ->title('Out of Stock')
                        ->body("Product \"{$model->name}\" is no longer available for sale.")
                        ->icon('heroicon-o-archive-box-x-mark')
                        ->danger()
                        ->actions([
                            Action::make('view')
                                ->button()
                                ->url(route('filament.admin.resources.products.edit', $model->id)),
                        ]),
                    $recipients
                 );
            }
        }

        // 💸 PAYMENT: Payment Failed / Received
        elseif ($model instanceof Payment && $model->isDirty('status')) {
            if ($model->status === 'failed') {
                $this->sendRaw(
                    Notification::make()
                        ->title('Payment Failed')
                        ->body("Payment for Order #{$model->order_id} did not succeed.")
                        ->icon('heroicon-o-exclamation-circle')
                        ->danger(),
                    $recipients
                );
            } elseif ($model->status === 'captured' || $model->status === 'success') {
                 $this->sendRaw(
                    Notification::make()
                        ->title('Payment Received')
                        ->body("Payment for Order #{$model->order_id} was successful.")
                        ->icon('heroicon-o-currency-dollar')
                        ->success(),
                    $recipients
                 );
            }
        }

        // 💸 REFUND: Refund Issued
        elseif ($model instanceof Refund && $model->isDirty('status')) {
            if ($model->status === 'approved' || $model->status === 'processed') {
                 $this->sendRaw(
                    Notification::make()
                        ->title('Refund Issued')
                        ->body("A refund has been processed for Order #{$model->order_id}.")
                        ->icon('heroicon-o-arrow-uturn-left')
                        ->success(),
                    $recipients
                 );
            }
        }

        // ⚙️ SYSTEM: Settings Updated
        elseif ($model instanceof SiteSetting) {
             $this->sendRaw(
                Notification::make()
                    ->title('System Alert')
                    ->body("Store settings were updated by Admin.")
                    ->icon('heroicon-o-cog-6-tooth')
                    ->color('gray'),
                $recipients
             );
        }
    }

    private function sendRaw(Notification $notification, $recipients)
    {
        try {
            $data = $notification->getDatabaseMessage();
            $now = now();
            
            foreach($recipients as $recipient) {
                DB::table('notifications')->insert([
                    'id' => (string) Str::uuid(),
                    'type' => 'Filament\Notifications\DatabaseNotification',
                    'notifiable_type' => get_class($recipient),
                    'notifiable_id' => $recipient->id,
                    'data' => json_encode($data),
                    'read_at' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        } catch (\Throwable $e) {
            \Log::error("AdminNotificationObserver Failed: " . $e->getMessage());
        }
    }
}
