@extends('layouts.main')

@section('content')
    <div class="container vh-100">
        <div class="row h-100 justify-content-center align-items-center">
            <div class="col-12 l-login text-center">
                <img src="{{ asset('/img/logo-efc.svg') }}" alt="EFC Compass" class="l-login__logo" />
                @if(count($errors))
                <p><strong>Your email address cannot be found.</strong></p>
                <p>Make sure you are using an email address that is used to correspond with EFC.</p>
                <p>If you are still facing problems, please contact Lucia Patuzzi (<a href="mailto:lpatuzzi@efc.be">lpatuzzi@efc.be</a>) or call <a href="tel:+3225128938">+32.2.512.8938</a> for further assistance.</p>
                <br/>
                @else
                <p>We need your work email to give you access to your benchmark report.</p>
                <p class="text-muted">After submitting we’ll send you a confirmation email with four digits to securely log in.</p>
                @endif
                <form method="POST" action="{{ url('/auth/token') }}">
                    {{ csrf_field() }}
                    <input
                        type="email" 
                        name="email" 
                        value="{{ old('email') }}"
                        placeholder="Email address" 
                        class="form-control text-center"
                    />
                    <br/>
                    <input type="submit" value="Submit" class="btn btn-primary l-login__button" />
                </form>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
@endsection
