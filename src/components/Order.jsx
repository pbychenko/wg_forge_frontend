import React from 'react';
import { getFullUserName, getOrderDate, formatCardNumber } from '../utils';
import UserDetailsModal from './UserDetailsModal.jsx';

const Order = ({ data: userData, onUserClick }) => {
  const { order, user, showUserDetails } = userData;

  return (
    <tr id={order.id}>
      <td>{order.transaction_id}</td>
      <td className="user_data">
        <a href="#" onClick={onUserClick}>{getFullUserName(user)}</a>
        <UserDetailsModal show={showUserDetails} data={user} />
      </td>
      <td>{getOrderDate(+order.created_at)}</td>
      <td>${order.total}</td>
      <td>{formatCardNumber(order.card_number)}</td>
      <td>{order.card_type}</td>
      <td>{order.order_country} ({order.order_ip})</td>
    </tr>
  );
};

export default Order;
