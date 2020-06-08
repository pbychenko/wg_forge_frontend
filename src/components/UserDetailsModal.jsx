import React from 'react';
// import companies from '../../data/companies.json';
const getBirthdayDate = (date) => {
  const formatNumber = (number) => number < 10 ? '0' + number : number;
  const newDate = new Date(date);
  const day = formatNumber(newDate.getDate());
  const month = formatNumber(newDate.getMonth() + 1);
  const year =  formatNumber(newDate.getYear());

  return `${day}/${month}/${year}`;
}

export default class UserDetails extends React.Component {
  render() {
    const {
      show,
      data,
    } = this.props;
    // const company = companies.filter(company => company.id === data.company_id)[0];
    // console.log(data);
    return (
      <div className="user-details" hidden={!show}>
        <p>Birthday: {getBirthdayDate(+data.birthday)}</p>
        <p><img src={data.avatar} width="100px" /></p>
        <p>Company: <a href={data.company_url} target="_blank">{data.company_title}</a></p>
        <p>Industry: {data['company_industry']} / {data['company_sector']}</p>
      </div>
    );
  }
}