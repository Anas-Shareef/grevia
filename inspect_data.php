$p = App\Models\Product::where('slug', 'stevia-jar')->first();
if ($p) {
    echo "Legacy Image: " . $p->image . PHP_EOL;
    echo "Gallery Count: " . $p->gallery()->count() . PHP_EOL;
} else {
    echo "Product not found." . PHP_EOL;
}
