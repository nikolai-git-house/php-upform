@extends('layouts.main')

@section('content')
    <div class="container vh-100">
        <div class="row h-100 justify-content-center align-items-center">
            <div class="col-12 l-login text-center">
                <img src="{{ asset('/img/logo-efc.svg') }}" alt="EFC" class="l-login__logo" />
                <p>Check your work email inbox and fill in the four digits of the security email.</p>
                <p class="text-muted">For security reasons the code will expire in 15 minutes.</p>
                <form method="POST" action="{{ url('/auth/login') }}">
                    {{ csrf_field() }}
                    <input
                        type="hidden" 
                        name="email" 
                        value="{{ $email }}"
                        placeholder="Email address" 
                        class="form-control text-center"
                    />
                    <input type="text" name="password" id="token-input">
                    <br/>
                    <br />
                    <input type="submit" value="Submit" class="btn btn-primary l-login__button" />
                </form>
                <div class="l-login__footer">
                    <p class="text-muted">Didn’t receive an email?
                        <br>
                        <span class="text-dark">
                        <a href="{{ url('/auth/token') }}">Retry?</a>
                        •
                        <a href="mailto:jbruns@vouw.co">Mail support</a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ mix('js/token.js') }}"></script>
@endsection
