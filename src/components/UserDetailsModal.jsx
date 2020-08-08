import React from 'react';
import { getBirthdayDate } from '../utils';

const UserDetails = ({ show, data }) => (
  <div className="user-details" hidden={!show}>
    <p>Birthday: {getBirthdayDate(+data.birthday)}</p>
    <p><img src={data.avatar} width="100px" /></p>
    <p>Company: <a href={data.company_url} target="blank">{data.company_title}</a></p>
    { /* eslint-disable-next-line dot-notation */ }
    <p>Industry: {data['company_industry']} / {data['company_sector']}</p>
  </div>
);

export default UserDetails;
