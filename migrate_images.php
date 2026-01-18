$products = App\Models\Product::whereNotNull('image')->get();
foreach ($products as $product) {
    if ($product->gallery()->count() === 0) {
        $product->gallery()->create([
            'image_path' => $product->image,
            'is_main' => true,
            'sort_order' => 0
        ]);
        $product->image = null; // Clear seed/legacy image to prevent ghosting
        $product->save();
        echo "Migrated: " . $product->name . PHP_EOL;
    } else {
        echo "Skipped (Already has gallery): " . $product->name . PHP_EOL;
    }
}
echo "Migration Complete." . PHP_EOL;
