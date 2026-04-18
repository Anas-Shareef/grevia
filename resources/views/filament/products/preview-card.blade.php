<div class="flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
    <div class="w-full max-w-[300px] bg-white rounded-[24px] p-2 border border-gray-100 shadow-sm overflow-hidden pointer-events-none">
        <!-- Image Mock -->
        <div class="relative aspect-[4/4.5] rounded-[20px] bg-[#f8fafc] flex items-center justify-center p-6 mb-4">
            <div class="absolute top-2 left-2">
                @php
                    $state = $getState() ?? [];
                    $record = $getRecord();
                    $badge = $state['badge'] ?? $record?->badge;
                @endphp
                @if(!empty($badge))
                    <div class="bg-[#16a34a] text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">
                        {{ $badge }}
                    </div>
                @endif
            </div>
            
            @php
                $image = $getRecord()?->image_url;
                if (!$image && $getRecord()?->image) {
                    $image = \Illuminate\Support\Facades\Storage::url($getRecord()->image);
                }
            @endphp

            @if($image)
                <img src="{{ $image }}" class="w-full h-full object-contain opacity-90">
            @else
                <div class="flex flex-col items-center justify-center text-gray-300">
                    <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span class="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                </div>
            @endif
        </div>

        <!-- Content -->
        <div class="px-3 pb-3">
            <span class="text-[8px] font-bold text-[#16a34a] uppercase tracking-[0.2em] mb-1 block opacity-70">
                {{ $record?->category?->name ?? 'Category' }}
            </span>
            
            <h3 class="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                {{ $state['name'] ?? $record?->name ?? 'Product Name' }}
            </h3>

            <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <span class="text-base font-black text-gray-900">₹{{ $state['price'] ?? $record?->price ?? '0' }}</span>
                <div class="w-7 h-7 bg-[#16a34a] rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
            </div>
        </div>
    </div>
</div>
