@php
    $order = $getRecord();
    $notes = $order->notes()->latest()->get();
@endphp

<div class="space-y-4" x-data="{ note: '', submitting: false }">
    <!-- Add Note Section -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-2">Add Internal Note</h4>
        
        <form @submit.prevent="
            if (!note.trim()) return;
            submitting = true;
            $wire.addNote({
                note: note,
                is_customer_visible: false
            }).then(() => {
                note = '';
                submitting = false;
            });
        ">
            <textarea 
                x-model="note"
                rows="3" 
                class="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500" 
                placeholder="Type a private note..."
                required
            ></textarea>

            <div class="mt-3 flex justify-end">
                <button 
                    type="submit" 
                    :disabled="submitting || !note.trim()"
                    class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
                >
                    <span x-show="!submitting">Add Note</span>
                    <span x-show="submitting">Adding...</span>
                </button>
            </div>
        </form>
    </div>

    <!-- History -->
    <div class="space-y-3">
        <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Note History</h4>
        
        @forelse($notes as $note)
            <div class="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                <div class="flex justify-between items-start mb-1">
                    <span class="text-xs font-bold text-gray-900 dark:text-white">{{ $note->user->name ?? 'System' }}</span>
                    <span class="text-[10px] text-gray-400">{{ $note->created_at->diffForHumans() }}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ $note->note }}</p>
            </div>
        @empty
            <div class="text-center py-4 text-xs text-gray-400 italic">
                No internal notes yet.
            </div>
        @endforelse
    </div>
</div>
