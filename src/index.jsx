import ReactDOM from 'react-dom';
import React from 'react';
import App from './App.jsx';

// class App extends React.Component {
//   render() {
//     return 1;
//   }
// }

export const run = () => ReactDOM.render(
  <App />,
  document.getElementById('app'),
);