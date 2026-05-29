<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    @php
        $siteSettings = \App\Models\SiteSetting::pluck('value', 'key');
        
        $path = request()->path();
        $siteTitle = null;
        $siteDescription = null;
        
        if ($path === 'privacy-policy') {
            $siteTitle = $siteSettings['policy_privacy_meta_title'] ?? null;
            $siteDescription = $siteSettings['policy_privacy_meta_description'] ?? null;
        } elseif ($path === 'terms-conditions') {
            $siteTitle = $siteSettings['policy_terms_meta_title'] ?? null;
            $siteDescription = $siteSettings['policy_terms_meta_description'] ?? null;
        } elseif ($path === 'refund-policy' || $path === 'return-policy') {
            $siteTitle = $siteSettings['policy_refund_meta_title'] ?? $siteSettings['policy_return_meta_title'] ?? null;
            $siteDescription = $siteSettings['policy_refund_meta_description'] ?? $siteSettings['policy_return_meta_description'] ?? null;
        } elseif ($path === 'shipping-policy') {
            $siteTitle = $siteSettings['policy_shipping_meta_title'] ?? null;
            $siteDescription = $siteSettings['policy_shipping_meta_description'] ?? null;
        }
        
        $siteTitle = $siteTitle ?: ($siteSettings['homepage_title'] ?? 'Grevia - Premium Organic Stevia & Monkfruit Sweeteners | Zero Calories');
        $siteDescription = $siteDescription ?: ($siteSettings['homepage_description'] ?? "Discover Grevia's premium organic sweeteners. 100% natural Stevia and Monkfruit with zero calories, zero glycemic impact.");
    @endphp
    <title>{{ $siteTitle }}</title>
    <meta name="description" content="{{ $siteDescription }}" />
    <meta name="author" content="{{ $siteSettings['store_name'] ?? 'Grevia' }}" />
    
    <meta property="og:title" content="{{ $siteTitle }}" />
    <meta property="og:description" content="{{ $siteDescription }}" />
    <meta property="og:type" content="website" />

    <script>
        window.GreviaSettings = {
            instagram_url: "{{ $siteSettings['instagram_url'] ?? '#' }}",
            facebook_url: "{{ $siteSettings['facebook_url'] ?? '#' }}",
            store_phone: "{{ $siteSettings['store_phone'] ?? '' }}",
            store_email: "{{ $siteSettings['store_email'] ?? '' }}",
            policy_privacy_content: {!! json_encode($siteSettings['policy_privacy_content'] ?? '') !!},
            policy_privacy_meta_title: {!! json_encode($siteSettings['policy_privacy_meta_title'] ?? '') !!},
            policy_privacy_meta_description: {!! json_encode($siteSettings['policy_privacy_meta_description'] ?? '') !!},
            policy_terms_content: {!! json_encode($siteSettings['policy_terms_content'] ?? '') !!},
            policy_terms_meta_title: {!! json_encode($siteSettings['policy_terms_meta_title'] ?? '') !!},
            policy_terms_meta_description: {!! json_encode($siteSettings['policy_terms_meta_description'] ?? '') !!},
            policy_refund_content: {!! json_encode($siteSettings['policy_refund_content'] ?? $siteSettings['policy_return_content'] ?? '') !!},
            policy_refund_meta_title: {!! json_encode($siteSettings['policy_refund_meta_title'] ?? $siteSettings['policy_return_meta_title'] ?? '') !!},
            policy_refund_meta_description: {!! json_encode($siteSettings['policy_refund_meta_description'] ?? $siteSettings['policy_return_meta_description'] ?? '') !!},
            policy_shipping_content: {!! json_encode($siteSettings['policy_shipping_content'] ?? '') !!},
            policy_shipping_meta_title: {!! json_encode($siteSettings['policy_shipping_meta_title'] ?? '') !!},
            policy_shipping_meta_description: {!! json_encode($siteSettings['policy_shipping_meta_description'] ?? '') !!},
        };
    </script>
    <link rel="icon" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/js/react/main.tsx'])
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    @if(!empty($siteSettings['google_analytics_id']))
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ $siteSettings['google_analytics_id'] }}"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '{{ $siteSettings['google_analytics_id'] }}');
        </script>
    @endif
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
