<?php
use Illuminate\Support\Facades\Route;

// Serve the React SPA for all non-API routes
Route::get('/{any}', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    return response('Frontend not built yet. Run: cd frontend && npm run build', 404);
})->where('any', '^(?!api|storage|admin-css|admin-js).*$');
