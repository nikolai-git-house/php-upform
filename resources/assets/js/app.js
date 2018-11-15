
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App.jsx';

const appMountNode = document.getElementById('app');

ReactDOM.render(<App />, appMountNode);
