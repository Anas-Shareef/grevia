<?php

namespace App\Console\Commands;

use App\Services\MailerLiteService;
use Illuminate\Console\Command;

class SyncMailerLite extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailerlite:sync {--type=all : The type of sync to perform: "all", "customers", or "subscribers"}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync database user accounts and newsletter subscribers to MailerLite';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');
        $apiKey = config('services.mailerlite.api_key');

        if (empty($apiKey)) {
            $this->error('MailerLite API Key is not configured in services.mailerlite.api_key / MAILERLITE_API_KEY .env variable.');
            return 1;
        }

        $service = new MailerLiteService();

        if (in_array($type, ['all', 'customers'])) {
            $this->info('Starting sync for registered customer accounts...');
            $count = $service->syncAllUsers();
            if ($count === false) {
                $this->error('Failed to sync customer accounts. Check logs for details.');
            } else {
                $this->info("Successfully synced {$count} customer accounts to MailerLite.");
            }
        }

        if (in_array($type, ['all', 'subscribers'])) {
            $this->info('Starting sync for newsletter subscribers...');
            $count = $service->syncAllSubscribers();
            if ($count === false) {
                $this->error('Failed to sync newsletter subscribers. Check logs for details.');
            } else {
                $this->info("Successfully synced {$count} newsletter subscribers to MailerLite.");
            }
        }

        $this->info('MailerLite synchronization completed.');
        return 0;
    }
}
