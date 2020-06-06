import React from 'react';
import { Alert } from 'react-bootstrap';

export default class App extends React.Component {
  render() {
    return (
      <>
        <Alert variant='info' className="text-center">
          Something wrong with newtwork please try later
      </Alert>
    </>
    );;
  }
}