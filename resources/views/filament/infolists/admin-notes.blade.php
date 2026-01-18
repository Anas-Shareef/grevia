@php
    $order = $getRecord();
    $notes = $order->notes()->latest()->get();
@endphp

<div class="space-y-6" x-data="{ note: '', notifyCustomer: false, submitting: false }">
    <!-- Action Card -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div class="p-5">
            <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">Add Comment</h3>
            
            <form @submit.prevent="
                if (!note.trim()) return;
                submitting = true;
                
                $wire.addNote({
                    note: note,
                    is_customer_visible: notifyCustomer
                }).then(() => {
                    note = '';
                    notifyCustomer = false;
                    submitting = false;
                });
            " class="space-y-4">
                <div class="relative">
                    <textarea 
                        x-model="note"
                        rows="4" 
                        class="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-sm transition-all duration-200" 
                        placeholder="Type your message here..."
                        required
                    ></textarea>
                </div>

                <div class="flex items-center justify-between pt-2">
                    <label class="group flex items-center gap-3 cursor-pointer select-none">
                        <div class="relative flex items-center">
                            <input 
                                type="checkbox" 
                                x-model="notifyCustomer"
                                class="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 checked:bg-blue-600 checked:border-blue-600 transition-all duration-200"
                            >
                            <svg class="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-0.5 top-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Notify Customer</span>
                    </label>

                    <button 
                        type="submit" 
                        :disabled="submitting || !note.trim()"
                        class="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                    >
                        <span x-show="!submitting">Submit Comment</span>
                        <span x-show="submitting" class="flex items-center gap-2">
                            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- History Header -->
    <div class="flex items-center gap-2 px-2">
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Comment History</h3>
        <div class="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
    </div>

    <!-- History List -->
    <div class="space-y-4">
        @forelse($notes as $note)
            <div class="group relative flex gap-4">
                <!-- Timeline Line & Dot -->
                <div class="flex flex-col items-center">
                    <div class="w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 shadow-sm
                        {{ $note->is_customer_visible ? 'bg-blue-500' : 'bg-gray-400' }}"></div>
                    @if(!$loop->last)
                        <div class="w-0.5 h-full bg-gray-100 dark:bg-gray-800 mt-1"></div>
                    @endif
                </div>

                <div class="flex-1 pb-6">
                    <div class="flex items-center justify-between mb-1.5">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-bold text-gray-900 dark:text-white">
                                {{ $note->user->name ?? 'System' }}
                            </span>
                            @if($note->is_customer_visible)
                                <span class="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight rounded bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                                    Customer Notified
                                </span>
                            @endif
                        </div>
                        <span class="text-[11px] font-medium text-gray-400 dark:text-gray-500 tabular-nums">
                            {{ $note->created_at->format('M d, Y • h:i A') }}
                        </span>
                    </div>
                    
                    <div class="p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-colors">
                        <p class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{{ $note->note }}</p>
                    </div>
                </div>
            </div>
        @empty
            <div class="py-8 text-center bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                <p class="text-sm text-gray-400 font-medium">No comments recorded yet</p>
            </div>
        @endforelse
    </div>
</div>
