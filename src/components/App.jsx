import React from 'react';
import { Table } from 'react-bootstrap';
import orders from '../../data/orders.json';
import users from '../../data/users.json';
import companies from '../../data/companies.json';
import UserDetailsModal from './UserDetailsModal.jsx';
import Statistics from './Statistics.jsx';
import { getOrderDate, formatCardNumber, getAverage, getMedian } from '../utils';
import _ from 'lodash';

const getUserName = (id) => {
  const user = users.filter(user => user.id === id)[0];
  const genderPrefix = user.gender === 'Male' ? 'Mr.': 'Ms.';

  return `${genderPrefix} ${user.first_name} ${user.last_name}`;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: orders,
      companies: companies,
      users: users,
      // activeUserData: null,
      // requestState: '',
      activeUserDetails: {},
      // showErrorBlock: false,
      // form: {
      //   name: '',
      //   comment: '',
      // },
    };
  } 

  renderRow = (order) => {
    const { users, companies} = this.state;
    const userData = users.filter(user => user.id === order.user_id)[0];
    const company = companies.filter(company => company.id === userData.company_id)[0];
    if (company) {
      userData['company_url'] = company.url;
      userData['company_title'] = company.title;
      userData['company_sector'] = company.sector;
      userData['company_industry'] = company.industry;
    }

    return (
      <tr key={order.id} id={order.id}>
        <td>{order.transaction_id}</td>
        <td className="user_data">
          <a href="#" onClick={this.handleUserDetailsClick(order.id)}>{getUserName(order.user_id)}</a>
          <UserDetailsModal show={this.state.activeUserDetails[order.id]} data={userData} />
        </td>
        <td>{getOrderDate(+order.created_at)}</td>
        <td>${order.total}</td>
        <td>{formatCardNumber(order.card_number)}</td>
        <td>{order.card_type}</td>
        <td>{order.order_country} ({order.order_ip})</td>
      </tr>
    );    
  }

  handleUserDetailsClick = (id) => (e) => {
    // const user = users.filter(user => user.id === id)[0];
    // console.log(user);
    e.preventDefault();
    
    const {activeUserDetails} = this.state;
    // console.log(activeUserDetails);
    if (!activeUserDetails[id] || (activeUserDetails[id] === false)) {
      this.setState({ activeUserDetails: {...activeUserDetails, [id]:true}});
    } else {
      this.setState({ activeUserDetails: {...activeUserDetails, [id]:false}});
    } 
  }

  renderData = () => {
    const { orders } = this.state;
    return orders.map(order => this.renderRow(order));
  }

  renderStatistics = () => {
    const { orders, users } = this.state;
    const malesIds = users.filter(user => user.gender === 'Male').map(user => user.id);
    const femalesIds = users.filter(user => user.gender === 'Female').map(user => user.id);
    // console.log(malesIds);
    // console.log(femalesIds);
    
    
    const maleOrders = orders.filter(order => malesIds.includes(order.user_id));
    const femaleOrders = orders.filter(order => femalesIds.includes(order.user_id));

    // console.log(maleOrders.length);
    // console.log(femaleOrders.length);    
    
    const orderSums = orders.map(order => +order.total);
    const maleOrderSums = maleOrders.map(order => +order.total);
    const femaleOrderSums = femaleOrders.map(order => +order.total);
    // console.log(maleOrderSums);
    // console.log(femaleOrderSums.length);

    const statistics = {};
    statistics.count = orders.length;
    statistics.total = _.sum(orderSums);
    statistics.median = getMedian(orderSums);
    statistics.average = getAverage(orderSums);
    statistics.maleAverage = getAverage(maleOrderSums);
    statistics.femaleAverage = getAverage(femaleOrderSums);
    
    return <Statistics data={statistics} />;
  }  

  render() {
    return (
      <>
        <Table responsive bordered>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User Info</th>
              <th>Order Date</th>
              <th>Order Amount</th>
              <th>Card Number</th>
              <th>Card Type</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
              {this.renderData()}
              {this.renderStatistics()}
          </tbody>
        </Table>
    </>
    );;
  }
}