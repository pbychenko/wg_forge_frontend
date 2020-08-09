/* eslint-disable dot-notation */
import React from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import Statistics from './Statistics.jsx';
import Order from './Order.jsx';
import {
  getStatistics, getUsersOfOrders,
  getFilteredOrders, sortOrders, getUserOfOrder,
} from '../utils';

const baseUrl = 'http://localhost:9000/api/';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      globalOrders: [],
      globalUsers: [],
      globalCompanies: [],
      orders: [],
      companies: [],
      users: [],
      searchValue: '',
      requestState: '',
      activeUserDetails: {},
      sorting: { by: '', direction: 'asc' },
      showErrorBlock: false,
    };
  }

  componentDidMount() {
    this.setState({ requestState: 'processing' }, async () => {
      try {
        const ordersRes = await axios.get(`${baseUrl}/orders.json`);
        const usersRes = await axios.get(`${baseUrl}/users.json`);
        const companiesRes = await axios.get(`${baseUrl}/companies.json`);
        this.setState({
          requestState: 'success',
          orders: ordersRes.data,
          globalOrders: ordersRes.data,
          users: usersRes.data,
          globalUsers: usersRes.data,
          companies: companiesRes.data,
          globalCompanies: companiesRes.data,
        });
      } catch (error) {
        this.setState({ requestState: 'failed', showErrorBlock: true });
        throw error;
      }
    });
  }

  handleChange = (e) => {
    const { value } = e.target;
    const { globalOrders, globalUsers, sorting } = this.state;

    if (value !== '') {
      const filteredOrders = getFilteredOrders(globalOrders, globalUsers, value);
      const filteredUsers = getUsersOfOrders(filteredOrders, globalUsers);
      const sortedFilteredOrders = sortOrders(sorting, filteredOrders, filteredUsers);
      this.setState({ searchValue: value, orders: sortedFilteredOrders, users: filteredUsers });
    } else {
      const sortedOrders = sortOrders(sorting, globalOrders, globalUsers);
      this.setState({ searchValue: value, orders: sortedOrders, users: globalUsers });
    }
  }

  renderRow = (order) => {
    const { users, companies } = this.state;
    const user = getUserOfOrder(users, order);
    const userCompany = companies.filter((company) => company.id === user.company_id)[0];
    if (userCompany) {
      user['company_url'] = userCompany.url;
      user['company_title'] = userCompany.title;
      user['company_sector'] = userCompany.sector;
      user['company_industry'] = userCompany.industry;
    }
    const userData = { order, user, showUserDetails: this.state.activeUserDetails[order.id] };

    return (
      <Order key={order.id} data={userData} onUserClick={this.handleUserDetailsClick(order.id)}/>
    );
  }

  handleUserDetailsClick = (id) => (e) => {
    e.preventDefault();
    const { activeUserDetails } = this.state;

    if (!activeUserDetails[id] || (activeUserDetails[id] === false)) {
      this.setState({ activeUserDetails: { ...activeUserDetails, [id]: true } });
    } else {
      this.setState({ activeUserDetails: { ...activeUserDetails, [id]: false } });
    }
  }

  renderData = () => {
    const { orders, users } = this.state;
    const statistics = getStatistics(orders, users);

    if (orders.length > 0) {
      return (
        <>
          {orders.map((order) => this.renderRow(order))}
          <Statistics data={statistics} />
        </>
      );
    }
    return (
      <tr style={{ textAlign: 'center' }}>
          <td colSpan="7">Nothing found</td>
      </tr>
    );
  }

  handleSort = (e) => {
    const map = {
      'Order Amount': 'total',
      'Order Date': 'created_at',
      'Transaction ID': 'transaction_id',
      'Card Type': 'card_type',
      Location: 'location',
      'User Info': 'user_name',
    };
    const { sorting, orders, users } = this.state;
    const columnName = e.target.id;

    if (columnName !== 'Card Number') {
      if (sorting.by === map[columnName]) {
        sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
      } else {
        sorting.by = map[columnName];
      }

      const sorted = sortOrders(sorting, orders, users);
      this.setState({ sorting, orders: sorted });
    }
  }

  render() {
    const { searchValue, sorting, requestState } = this.state;
    const getSortRow = (condition) => (condition ? (<span>&#8595;</span>) : '');
    console.log(this.state.requestState);

    if (requestState === 'processing') {
      const centerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      };
      const spinnerSizeStyle = {
        width: '13rem',
        height: '13rem',
      };
      return (
        <div className="text-center" style = {centerStyle}>
          <Spinner animation="border" style={spinnerSizeStyle} />
        </div>
      );
    }

    if (requestState === 'success') {
      return (
        <>
          <Table responsive bordered>
            <thead>
            <tr>
              <th>Search:</th>
              <th colSpan="6"><input type="text" id="search" value={searchValue} onChange={this.handleChange}/></th>
            </tr>
              <tr onClick={this.handleSort}>
                <th style={{ cursor: 'pointer' }} id='Transaction ID'>Transaction ID {getSortRow(sorting.transaction_id)}</th>
                <th style={{ cursor: 'pointer' } } id='User Info'>User Info {getSortRow(sorting.user_name)}</th>
                <th style={{ cursor: 'pointer' }} id='Order Date'>Order Date {getSortRow(sorting.created_at)}</th>
                <th style={{ cursor: 'pointer' }} id='Order Amount'>Order Amount {getSortRow(sorting.total)}</th>
                <th>Card Number</th>
                <th style={{ cursor: 'pointer' }} id='Card Type'>Card Type {getSortRow(sorting.card_type)}</th>
                <th style={{ cursor: 'pointer' }} id='Location'>Location {getSortRow(sorting.location)}</th>
              </tr>
            </thead>
            <tbody>
                {this.renderData()}
            </tbody>
          </Table>
      </>
      );
    }
    return (
      <>
        <Alert variant='info' className="text-center">
          Something wrong with newtwork please try again later
        </Alert>
      </>
    );
  }
}
