import React from 'react';
import { Table } from 'react-bootstrap';
import orders from '../../data/orders.json';


const getOrderDate = (date) => {
  const formatNumber = (number) => number < 10 ? '0' + number : number;
  const newDate = new Date(date);
  const day = formatNumber(newDate.getDate());
  const month = formatNumber(newDate.getMonth() + 1);
  const year =  formatNumber(newDate.getYear());
  const hours = formatNumber(newDate.getHours());
  const minutes = formatNumber(newDate.getMinutes());
  const seconds = formatNumber(newDate.getSeconds());

  return `${day}/${month}/${year} ${hours}/${minutes}/${seconds}`;
}

const formatCardNumber = (cardNumber) => {
  return cardNumber.slice(0, 2) + '********' + cardNumber.slice(-4);
}

export default class App extends React.Component {
  renderRow = (order) => {
    return (
      <tr key={order.id} id={order.id}>
        <td>{order.transaction_id}</td>
        <td className="user_data">{order.id}</td>
        <td>{getOrderDate(+order.created_at)}</td>
        <td>${order.total}</td>
        <td>{formatCardNumber(order.card_number)}</td>
        <td>{order.card_type}</td>
        <td>{order.order_country} ({order.order_ip})</td>
      </tr>
    );    
  }

  renderData = () => {
    return orders.map(order => this.renderRow(order));
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
          </tbody>
        </Table>
    </>
    );;
  }
}