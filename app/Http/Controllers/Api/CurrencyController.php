<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Organisation;
use Auth;
use App\Models\CurrencyRate;

class CurrencyController extends Controller
{
    public function index(Request $request)
    {
        $latest = CurrencyRate::orderBy('year', 'desc')->first();
        $currencies = CurrencyRate::where('year', $latest->year)->get();
        return $currencies;
    }
}
