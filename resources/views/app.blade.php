<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    @php
        $siteSettings = \App\Models\SiteSetting::pluck('value', 'key');
        $siteTitle = $siteSettings['homepage_title'] ?? 'Grevia - Premium Organic Stevia & Monkfruit Sweeteners | Zero Calories';
        $siteDescription = $siteSettings['homepage_description'] ?? "Discover Grevia's premium organic sweeteners. 100% natural Stevia and Monkfruit with zero calories, zero glycemic impact.";
    @endphp
    <title>{{ $siteTitle }}</title>
    <meta name="description" content="{{ $siteDescription }}" />
    <meta name="author" content="{{ $siteSettings['store_name'] ?? 'Grevia' }}" />
    
    <meta property="og:title" content="{{ $siteSettings['homepage_title'] ?? 'Grevia - Sweetness Without Sacrifice' }}" />
    <meta property="og:description" content="{{ $siteDescription }}" />
    <meta property="og:type" content="website" />

    <script>
        window.GreviaSettings = {
            instagram_url: "{{ $siteSettings['instagram_url'] ?? '#' }}",
            facebook_url: "{{ $siteSettings['facebook_url'] ?? '#' }}",
            store_phone: "{{ $siteSettings['store_phone'] ?? '' }}",
            store_email: "{{ $siteSettings['store_email'] ?? '' }}",
        };
    </script>
    <link rel="icon" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
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
