
<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\BenefitsPageController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsletterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public Routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/settings', [SiteSettingController::class, 'index']);
Route::post('/auth/firebase', [AuthController::class, 'firebase']);
Route::get('/content/benefits-page', [ContentController::class, 'getBenefitsPage']);
Route::get('/content/hero-banner', [ContentController::class, 'getHeroBanner']);
Route::get('/content/footer', [ContentController::class, 'getFooter']);
Route::get('/content/contact', [ContactController::class, 'index']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'changePassword']);

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{product_id}', [WishlistController::class, 'destroy']);
    
    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    Route::post('/orders/{id}/reorder', [OrderController::class, 'reorder']);

    // Addresses
    Route::prefix('customer')->group(function () {
        Route::get('/addresses', [AddressController::class, 'index']);
        Route::post('/addresses', [AddressController::class, 'store']);
        Route::put('/addresses/{id}', [AddressController::class, 'update']);
        Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    });

    // Content (Protected) - Removed as it conflicted with public route
    // Route::prefix('content')->group(function () {
    //    Route::get('/benefits-page', [BenefitsPageController::class, 'index']);
    // });
    
    // Checkout & Payment
    Route::prefix('checkout')->group(function () {
        Route::post('/razorpay/create-order', [\App\Http\Controllers\Api\RazorpayController::class, 'createOrder']);
        Route::post('/razorpay/verify', [\App\Http\Controllers\Api\RazorpayController::class, 'verifyPayment']);
    });

    // Reviews (Customer)
    Route::get('/my-reviews', [ReviewController::class, 'userReviews']);
    
    // Cart (Server-side sync for logged-in users)
    Route::prefix('cart')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\CartController::class, 'index']);
        Route::post('/sync', [\App\Http\Controllers\Api\CartController::class, 'sync']);
        Route::post('/item', [\App\Http\Controllers\Api\CartController::class, 'addItem']);
        Route::delete('/item/{productId}', [\App\Http\Controllers\Api\CartController::class, 'removeItem']);
        Route::delete('/clear', [\App\Http\Controllers\Api\CartController::class, 'clear']);
    });
    
    // Reviews (Customer)
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
});

// Post-Auth Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/reviews', [ReviewController::class, 'index']); // Public reviews list
Route::post('/reviews', [ReviewController::class, 'store']); // Public submit (handles guest/auth)
Route::get('/shipping-methods', [App\Http\Controllers\Api\ShippingMethodController::class, 'index']);

// Contact (Public)
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1');
