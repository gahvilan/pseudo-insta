import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase'
import App from './App';
import './index.css';


var config = {
    apiKey: "AIzaSyD63h-z55H26750E3pfT1GM0RHjiOBVcJI",
    authDomain: "pseudo-insta.firebaseapp.com",
    databaseURL: "https://pseudo-insta.firebaseio.com",
    storageBucket: "pseudo-insta.appspot.com",
    messagingSenderId: "502298043139"
  };
firebase.initializeApp(config);


ReactDOM.render(
  <App />,
  document.getElementById('root')
);