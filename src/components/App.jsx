import React from 'react';
import { Table } from 'react-bootstrap';
import orders from '../../data/orders.json';
import users from '../../data/users.json';
import companies from '../../data/companies.json';
import UserDetailsModal from './UserDetailsModal.jsx';
import Statistics from './Statistics.jsx';
import { getOrderDate, formatCardNumber, getAverage, getMedian, getStatistics, getFilteredOrders, getFilteredOrdersByUserName, sortOrders } from '../utils';
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
      searchValue: '',
      // globalOrders: orders,
      // globalUsers: users,
      // globalCompanies: companies,
      // activeUserData: null,
      // requestState: '',
      activeUserDetails: {},
      sorting: {
        created_at: false,
        total: false,
        transaction_id: false,
        card_type: false,
        location: false,
        user: false,
      }
      // showErrorBlock: false,
      // form: {
      //   name: '',
      //   comment: '',
      // },
    };
  }

  handleChange = (e) => {
    const { value } = e.target;
    const {sorting} = this.state;
    console.log(value);

    // const {globalOrders, globalUsers} = this.state;
    
    if (value !== '') {
      const filteredOrders = getFilteredOrders(orders, users, value);
      // const filteredOrders = getFilteredOrders(globalOrders, globalUsers, value);
      const filteredOrdersUserIds = filteredOrders.map(order => order.user_id);
      const filteredUsers = users.filter(user => filteredOrdersUserIds.includes(user.id));
      const sortedFilteredOrders = sortOrders(sorting, filteredOrders, filteredUsers);
      this.setState({ searchValue: value, orders: sortedFilteredOrders, users: filteredUsers });
      // this.setState({ searchValue: value, orders: filteredOrders, users: filteredUsers });
    } else {
      const sortedOrders = sortOrders(sorting, orders, users);
      this.setState({ searchValue: value, orders: sortedOrders, users });      
    }
    // this.sortOrders();       
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
    if (orders.length > 0) {
      return (
        <>
          {orders.map(order => this.renderRow(order))}
          {this.renderStatistics()}
        </>
      );
    }
    return (
      <tr style={{textAlign: 'center'}}>
          <td colSpan="7">Nothing found</td>
      </tr>
    );
  }

  renderStatistics = () => {
    const { orders, users } = this.state;
    const statistics = getStatistics(orders, users);
    
    return <Statistics data={statistics} />;
  }

  handleSort = (e) => {
    const map = {
      'Order Amount': 'total',
      'Order Date': 'created_at',
      'Transaction ID': 'transaction_id',
      'Card Type': 'card_type',
      'Location' : 'location',
      'User Info': 'user',
    };
    const { sorting, orders, users } = this.state;
    const columnName = e.target.id;
    if (columnName !== 'Card Number') {
      Object.keys(sorting).forEach((key) => {
        // console.log(key);
        sorting[key] = (key === map[columnName]) ? !sorting[key] : false;
      });
      const sorted = sortOrders(sorting, orders, users);
      this.setState({ sorting, orders: sorted });
    }
  }

  render() {
    const { searchValue, sorting } = this.state;
    const map = {
      'Order Amount': 'total',
      'Order Date': 'created_at',
      'Transaction ID': 'transaction_id',
      'Card Type': 'card_type',
      'Location' : 'location',
      'User Info': 'user',
    };
    const getStortRow = condition => condition ? (<span>&#8595;</span>) : '';
    // const row = () => (<span>&#8595;</span>);
    // console.log(row(sorting.transaction_id));
    console.log(sorting);

    return (
      <>
        <Table responsive bordered>
          <thead>
          <tr>
            <th>Search:</th>
            <th colSpan="6"><input type="text" id="search" value={searchValue} onChange={this.handleChange}/></th>
          </tr>
            <tr onClick={this.handleSort}>
              <th style={{cursor: "pointer"}} id='Transaction ID'>Transaction ID {getStortRow(sorting.transaction_id)}</th>
              <th style={{cursor: "pointer"}} id='User Info'>User Info {getStortRow(sorting.user)}</th>
              <th style={{cursor: "pointer"}} id='Order Date'>Order Date {getStortRow(sorting.created_at)}</th>
              <th style={{cursor: "pointer"}} id='Order Amount'>Order Amount {getStortRow(sorting.total)}</th>
              <th>Card Number</th>
              <th style={{cursor: "pointer"}} id='Card Type'>Card Type {getStortRow(sorting.card_type)}</th>
              <th style={{cursor: "pointer"}} id='Location'>Location {getStortRow(sorting.location)}</th>
            </tr>
          </thead>
          <tbody>
              {this.renderData()}
              {/* {this.renderStatistics()} */}
          </tbody>
        </Table>
    </>
    );;
  }
}