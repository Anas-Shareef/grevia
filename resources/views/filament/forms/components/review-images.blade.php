<div class="grid grid-cols-4 gap-4">
    @foreach($getRecord()->images as $image)
        <div class="relative group">
            <a href="{{ asset('storage/' . $image->image_path) }}" target="_blank">
                <img src="{{ asset('storage/' . $image->image_path) }}" 
                     alt="Review Image" 
                     class="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-primary-500 transition-colors">
            </a>
        </div>
    @endforeach
</div>
