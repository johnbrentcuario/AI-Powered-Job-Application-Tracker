<?php

use Illuminate\Support\Facades\Route;

// For any URL, load the welcome view and let React handle the routing
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');