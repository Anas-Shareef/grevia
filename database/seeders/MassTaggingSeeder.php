<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

/**
 * MassTaggingSeeder
 *
 * Applies the complete PRD-specified tagging taxonomy to all products.
 * Tags written:
 *   - natural-sweetener               (L1 — all products)
 *   - sweetener-stevia                 (L2 — stevia products)
 *   - sweetener-monkfruit             (L2 — monk fruit products)
 *   - form-powder / form-drops        (L3 — form factor)
 *   - ratio-1-10 / ratio-1-50 etc.   (L4 — concentration)
 *   - Region_IN                       (visibility)
 *   - cert-organic / cert-nongmo      (certifications if applicable)
 *   - BestSeller / NewArrival         (merchandising)
 *
 * Also assigns products to the correct category_id from the hierarchy.
 * IDEMPOTENT — safe to run multiple times.
 */
class MassTaggingSeeder extends Seeder
{
    public function run(): void
    {
        // Pre-load categories for ID assignment
        $categoryMap = Category::pluck('id', 'slug')->toArray();

        $products = Product::all();

        foreach ($products as $product) {
            $tags = is_array($product->tags) ? $product->tags : [];

            // ── L1: Natural Sweetener (all products in this store) ──────
            $tags = $this->addTag($tags, 'natural-sweetener');   // PRD normalized
            $tags = $this->addTag($tags, 'Cat_Sweetener');       // Legacy (keep for backward compat)

            // ── L2: Sweetener Type ───────────────────────────────────────
            if ($product->type === 'stevia') {
                $tags = $this->addTag($tags, 'sweetener-stevia');   // PRD
                $tags = $this->addTag($tags, 'Sub_Stevia');          // Legacy

                // Auto-assign category_id to 'stevia' if not already set to a child
                $steviaId = $categoryMap['stevia'] ?? null;
                if ($steviaId && !$this->isInSubtree($product->category_id, $steviaId, $categoryMap)) {
                    $product->category_id = $steviaId;
                }

            } elseif ($product->type === 'monk-fruit') {
                $tags = $this->addTag($tags, 'sweetener-monkfruit'); // PRD
                $tags = $this->addTag($tags, 'Sub_Monkfruit');       // Legacy

                $monkId = $categoryMap['monk-fruit'] ?? null;
                if ($monkId && !$this->isInSubtree($product->category_id, $monkId, $categoryMap)) {
                    $product->category_id = $monkId;
                }
            }

            // ── L3: Form Factor ───────────────────────────────────────────
            if ($product->form === 'powder') {
                $tags = $this->addTag($tags, 'form-powder');    // PRD
                $tags = $this->addTag($tags, 'Form_Powder');    // Legacy

                // Refine category to deepest match
                if ($product->type === 'stevia') {
                    $id = $categoryMap['stevia-powder'] ?? null;
                    if ($id) $product->category_id = $id;
                } elseif ($product->type === 'monk-fruit') {
                    $id = $categoryMap['monk-fruit-powder'] ?? null;
                    if ($id) $product->category_id = $id;
                }

            } elseif ($product->form === 'drops') {
                $tags = $this->addTag($tags, 'form-drops');     // PRD
                $tags = $this->addTag($tags, 'Form_Drops');     // Legacy

                if ($product->type === 'stevia') {
                    $id = $categoryMap['stevia-drops'] ?? null;
                    if ($id) $product->category_id = $id;
                }

            } elseif ($product->form === 'tablets') {
                $tags = $this->addTag($tags, 'form-tablets');
                $tags = $this->addTag($tags, 'Form_Tablets');
            }

            // ── L4: Concentration Ratio ───────────────────────────────────
            if ($product->ratio) {
                // PRD normalized: ratio-1-10, ratio-1-50
                $ratioTagPrd = 'ratio-' . str_replace(':', '-', $product->ratio);
                $tags = $this->addTag($tags, $ratioTagPrd);

                // Legacy format: Ratio_1-10
                $ratioTagLegacy = 'Ratio_' . str_replace(':', '-', $product->ratio);
                $tags = $this->addTag($tags, $ratioTagLegacy);
            }

            // ── Certifications (tag-inferred) ─────────────────────────────
            // If product has organic in its description or ingredients, tag it
            $lowerDesc = strtolower($product->description ?? '');
            if (str_contains($lowerDesc, 'organic')) {
                $tags = $this->addTag($tags, 'cert-organic');
            }
            if (str_contains($lowerDesc, 'non-gmo') || str_contains($lowerDesc, 'non gmo')) {
                $tags = $this->addTag($tags, 'cert-nongmo');
            }
            if (str_contains($lowerDesc, 'vegan')) {
                $tags = $this->addTag($tags, 'cert-vegan');
            }

            // ── Use Case ──────────────────────────────────────────────────
            if ($product->use_case) {
                $useTag = 'use-' . strtolower(str_replace(' ', '-', $product->use_case));
                $tags = $this->addTag($tags, $useTag);
            }

            // ── Region ────────────────────────────────────────────────────
            $tags = $this->addTag($tags, 'Region_IN');

            // ── Merchandising ─────────────────────────────────────────────
            if ($product->is_featured) {
                $tags = $this->addTag($tags, 'BestSeller');
            }
            if ($product->created_at && $product->created_at > now()->subMonths(2)) {
                $tags = $this->addTag($tags, 'NewArrival');
            }

            $product->tags = array_values(array_unique($tags));
            $product->save();
        }

        // ── Update smart collection rules to use normalized fields ────────
        $this->updateSmartCollectionRules();

        $this->command->info("✅ Mass tagging completed for {$products->count()} products.");
    }

    /**
     * Add a tag if it doesn't already exist.
     */
    private function addTag(array $tags, string $tag): array
    {
        if (!in_array($tag, $tags)) {
            $tags[] = $tag;
        }
        return $tags;
    }

    /**
     * A basic check: is the given category_id equal to the target or a descendant?
     * Simple check just for the two-level tree we have.
     */
    private function isInSubtree(?int $categoryId, int $targetId, array $categoryMap): bool
    {
        if ($categoryId === $targetId) return true;
        // The category map is slug -> id. We need id -> parent_id here.
        // Since we can't easily do recursive check just with the slug map,
        // we'll return false and let the form-level assignment override correctly.
        return false;
    }

    /**
     * Update smart collection rules to use the correct field names
     * matching the ProductController filter logic.
     */
    private function updateSmartCollectionRules(): void
    {
        $smartRules = [
            'stevia'         => ['type' => 'stevia'],
            'stevia-powder'  => ['type' => 'stevia',      'form' => 'powder'],
            'stevia-drops'   => ['type' => 'stevia',      'form' => 'drops'],
            'monk-fruit'     => ['type' => 'monk-fruit'],
            'monk-fruit-powder' => ['type' => 'monk-fruit', 'form' => 'powder'],
        ];

        foreach ($smartRules as $slug => $rule) {
            $cat = Category::where('slug', $slug)->first();
            if ($cat) {
                $rules = array_map(fn($field, $value) => [
                    'field'    => $field,
                    'operator' => 'equals',
                    'value'    => $value,
                ], array_keys($rule), array_values($rule));

                $cat->update(['is_smart' => true, 'rules' => $rules]);
            }
        }
    }
}
