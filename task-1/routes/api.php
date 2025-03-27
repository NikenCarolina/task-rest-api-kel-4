<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SaldoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


    Route::post('users/register', [AuthController::class, 'register']);
    Route::post('users/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/users/logout', [AuthController::class, 'logout']);
        Route::post('/informasi-saldo', [SaldoController::class, 'showSaldo'])->middleware('snap-bi');
    });
