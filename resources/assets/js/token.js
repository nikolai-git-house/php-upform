require('./bootstrap');
require('bootstrap-pincode-input');

import $ from 'jquery';

$(() => {
    $('#token-input').pincodeInput({inputs:4, hidedigits: false}).focus();
});