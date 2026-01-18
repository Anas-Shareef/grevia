$p = App\Models\Product::where('slug', 'stevia-jar')->first();
if ($p) {
    echo "Product: " . $p->name . PHP_EOL;
    foreach($p->gallery as $img) {
        echo "Gallery ID: " . $img->id . " | Path: " . $img->image_path . " | Is Main: " . ($img->is_main ? 'Yes' : 'No') . " | URL: " . $img->url . PHP_EOL;
    }
} else {
    echo "Product not found." . PHP_EOL;
}
