<x-filament-panels::page>
    <form wire:submit="save">
        {{ $this->schema }}

        <div class="mt-6 flex justify-end gap-3">
            <x-filament::button type="submit" size="lg">
                Save Settings
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
