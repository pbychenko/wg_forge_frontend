import React from 'react';
import { getFullUserName, getOrderDate, formatCardNumber } from '../utils';
import UserDetailsModal from './UserDetailsModal.jsx';

export default class Order extends React.Component {
  render() {
    const { data: userData, onUserClick } = this.props;
    const { order, user, activeUserDetails } = userData;

    return (
      <tr id={order.id}>
        <td>{order.transaction_id}</td>
        <td className="user_data">
          <a href="#" onClick={onUserClick}>{getFullUserName(user)}</a>
          <UserDetailsModal show={activeUserDetails} data={user} />
        </td>
        <td>{getOrderDate(+order.created_at)}</td>
        <td>${order.total}</td>
        <td>{formatCardNumber(order.card_number)}</td>
        <td>{order.card_type}</td>
        <td>{order.order_country} ({order.order_ip})</td>
      </tr>
    );
  }
}
