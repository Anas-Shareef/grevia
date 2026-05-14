<div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">

    {{-- Orders Backup --}}
    <div class="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <svg class="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        </div>
        
        <div class="relative z-10">
            <div class="w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 rounded-xl mb-4 text-blue-600 dark:text-blue-400">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Orders</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">Download complete transaction history and sales data.</p>
            
            <x-filament::button
                wire:click="exportOrders"
                color="info"
                class="w-full shadow-sm"
                icon="heroicon-o-arrow-down-tray"
            >
                Export Excel
            </x-filament::button>
        </div>
    </div>

    {{-- Products Backup --}}
    <div class="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <svg class="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        </div>

        <div class="relative z-10">
            <div class="w-12 h-12 flex items-center justify-center bg-green-50 dark:bg-green-900/30 rounded-xl mb-4 text-green-600 dark:text-green-400">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Products</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">Backup your entire catalog and inventory levels.</p>
            
            <x-filament::button
                wire:click="exportProducts"
                color="success"
                class="w-full shadow-sm"
                icon="heroicon-o-arrow-down-tray"
            >
                Export Excel
            </x-filament::button>
        </div>
    </div>

    {{-- Customers Backup --}}
    <div class="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <svg class="w-16 h-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        </div>

        <div class="relative z-10">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-50 dark:bg-purple-900/30 rounded-xl mb-4 text-purple-600 dark:text-purple-400">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Customers</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">Secure your customer database and user contact info.</p>
            
            <x-filament::button
                wire:click="exportUsers"
                color="warning"
                class="w-full shadow-sm"
                icon="heroicon-o-arrow-down-tray"
            >
                Export Excel
            </x-filament::button>
        </div>
    </div>

</div>
