<div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
    <div class="flex items-center justify-between mb-2">
        <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ number_format($count) }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Recipients
        </span>
    </div>
    
    @if($segment)
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {{ $segment['label'] }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $segment['description'] }}
            </p>
            <p class="text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium">
                💡 {{ $segment['use_case'] }}
            </p>
        </div>
    @endif
    
    @if($count === 0)
        <div class="mt-3 p-2 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded">
            <p class="text-xs text-warning-700 dark:text-warning-400">
                ⚠️ No recipients found for this segment. Campaign cannot be sent.
            </p>
        </div>
    @endif
</div>
