<div class="grid grid-cols-4 gap-4">
    @foreach($getRecord()->images as $image)
        <div class="relative group">
            <a href="{{ $image->url }}" target="_blank">
                <img src="{{ $image->url }}" 
                     alt="Review Image" 
                     class="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-primary-500 transition-colors">
            </a>
        </div>
    @endforeach
</div>
