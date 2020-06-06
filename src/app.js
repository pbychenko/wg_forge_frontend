// this is an example of improting data from JSON
import orders from '../data/orders.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App.jsx';

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);

// export default (function () {
//     // YOUR CODE GOES HERE
//     // next line is for example only
//     // document.getElementById("app").innerHTML = "<h1>Hello WG Forge</h1>";
// }());
