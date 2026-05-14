<div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">

    {{-- Orders Backup --}}
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
                <x-heroicon-o-shopping-bag class="w-6 h-6" />
            </div>
            <div>
                <h4 class="font-bold text-gray-900">Orders</h4>
                <p class="text-xs text-gray-500">Sales & Transactions</p>
            </div>
        </div>
        <x-filament::button
            wire:click="exportOrders"
            color="info"
            size="sm"
            icon="heroicon-o-arrow-down-tray"
        >
            Export Excel
        </x-filament::button>
    </div>

    {{-- Products Backup --}}
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-green-50 rounded-lg text-green-600">
                <x-heroicon-o-squares-2x2 class="w-6 h-6" />
            </div>
            <div>
                <h4 class="font-bold text-gray-900">Products</h4>
                <p class="text-xs text-gray-500">Inventory & Catalog</p>
            </div>
        </div>
        <x-filament::button
            wire:click="exportProducts"
            color="success"
            size="sm"
            icon="heroicon-o-arrow-down-tray"
        >
            Export Excel
        </x-filament::button>
    </div>

    {{-- Customers Backup --}}
    <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-purple-50 rounded-lg text-purple-600">
                <x-heroicon-o-users class="w-6 h-6" />
            </div>
            <div>
                <h4 class="font-bold text-gray-900">Customers</h4>
                <p class="text-xs text-gray-500">User Database</p>
            </div>
        </div>
        <x-filament::button
            wire:click="exportUsers"
            color="warning"
            size="sm"
            icon="heroicon-o-arrow-down-tray"
        >
            Export Excel
        </x-filament::button>
    </div>

</div>
