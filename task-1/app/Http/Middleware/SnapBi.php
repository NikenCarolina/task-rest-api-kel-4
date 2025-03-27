<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SnapBi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    public function handle(Request $request, Closure $next): Response
    {
        // Header yang diharapkan
        $expectedHeaders = [
            'X-TIMESTAMP'   => '2025-03-26',
            'X-SIGNATURE'   => 'MayBank2025',
            'ORIGIN'        => 'www.maybank.com',
            'X-PARTNER-ID'  => '123456',
            'X-EXTERNAL-ID' => '78910',
            'CHANNEL-ID'    => '95221',
        ];

        // Cek apakah semua header ada dan nilainya sesuai
        foreach ($expectedHeaders as $key => $expectedValue) {
            if (!$request->hasHeader($key) || $request->header($key) !== $expectedValue) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Invalid header: $key"
                ], 400);
            }
        }

        return $next($request);
    }
}
