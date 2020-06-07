import React from 'react';

export default class UserDetails extends React.Component {
  render() {
    const {
      show,
      data,
    } = this.props;
    // console.log(data);
    return (
      <div className="user-details" hidden={!show}>
        <p>{data.birthday}</p>
        <p><img src="" width="100px" /></p>
        <p>Company: <a href="http://awesome.website">Bumbershoot Corp.</a></p>
        <p>Industry: Apparel / Consumer Services</p>
      </div>
    );
  }
}