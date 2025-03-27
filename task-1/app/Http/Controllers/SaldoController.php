<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SaldoController extends Controller{
    
    public function showSaldo()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        // Contoh data saldo, bisa diganti dengan data dari database
        $saldo = [
            'account_number' => '1234567890',
            'balance' => 1000000, // Saldo contoh dalam IDR
            'currency' => 'IDR',
            'last_updated' => now()->toDateTimeString(),
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Informasi saldo berhasil diambil',
            'data' => $saldo
        ], 200);
    }
}
