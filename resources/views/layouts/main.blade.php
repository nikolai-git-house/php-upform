<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>EFC Compass</title>

        <link href={{ mix('css/app.css') }} type="text/css" rel="stylesheet" />
    </head>
    <body>
        @yield('content')
    </body>

    @yield('scripts')
</html>
