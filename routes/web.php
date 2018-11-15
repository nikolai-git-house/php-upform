<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Route::middleware('throttle:30,1')->namespace('Auth')->group(function () {
    Route::get('/auth/token', 'LoginController@showLoginForm')->name('login');
    Route::post('/auth/token', 'LoginController@otp');
    Route::post('/auth/login', 'LoginController@login');
    Route::get('/auth/logout', 'LoginController@logout');
});

Route::middleware('auth')->group(function () {
    Route::get('/home', function () {
        return redirect('/');
    });

    Route::get('/', function () {
        return view('survey');
    });

    Route::get('user/exportExcel', 'UserController@exportExcelFile');
    Route::get('user/exportCsv', 'UserController@exportCsvFile');

    Route::prefix('api')->namespace('Api')->group(function () {
        Route::resource('categories', 'CategoryController', ['only' => ['index']]);

        Route::get('organisations', 'OrganisationController@index');
        Route::get('organisation', 'OrganisationController@show');
        Route::get('currencies', 'CurrencyController@index');
        Route::resource('surveys', 'SurveyController', ['only' => ['index', 'show', 'store']]);
        Route::resource('surveys.answers', 'AnswerController', ['only' => ['index', 'store', 'destroy']]);
        Route::resource('surveys.questions', 'QuestionController', ['only' => ['index', 'show', 'store', 'destroy']]);
        Route::resource('surveys.questions.analytics', 'AnalyticsController', ['only' => 'index']);
    });
});
