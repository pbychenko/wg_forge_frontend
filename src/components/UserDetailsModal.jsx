import React from 'react';
// import companies from '../../data/companies.json';

export default class UserDetails extends React.Component {
  render() {
    const {
      show,
      data,
    } = this.props;
    // const company = companies.filter(company => company.id === data.company_id)[0];
    // console.log(company);
    return (
      <div className="user-details" hidden={!show}>
        <p>{data.birthday}</p>
        <p><img src={data.avatar} width="100px" /></p>
        <p>Company: <a href={data.company_url} target="_blank">Bumbershoot Corp.</a></p>
        <p>Industry: {data.company_intustry} / {data.company_title}</p>
      </div>
    );
  }
}