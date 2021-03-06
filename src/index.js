import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase, { messaging } from './firebase';
// import * as serviceWorker from './serviceWorker';

if (firebase.messaging.isSupported()) {
  messaging.usePublicVapidKey("BIUahBDHm8uSYVl3WGvEl4BS2v8X0yU8bkNjQiid_5x5RzlzDR2JY0uJeBzgBey1b1AvdI_Z2Bk5gwYOZpiup4g");
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../firebase-messaging-sw.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });
}
