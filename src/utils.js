/* eslint-disable no-param-reassign */
import _ from 'lodash';
import { locationCompare, nameCompare } from './comparators';

const getAverage = (arr) => _.sum(arr) / arr.length;

const getMedian = (arr) => {
  const sorted = _.sortBy(arr);
  if (arr.length % 2 === 1) {
    const medianIndex = Math.ceil(arr.length / 2);
    return sorted[medianIndex];
  }

  const middle = arr.length / 2;

  return (sorted[middle - 1] + sorted[middle]) / 2;
};

const formatNumber = (number) => ((number < 10) ? (`0${number}`) : number);

export const getFullUserName = (userData) => {
  const genderPrefix = userData.gender === 'Male' ? 'Mr.' : 'Ms.';

  return `${genderPrefix} ${userData.first_name} ${userData.last_name}`;
};

export const getOrderDate = (date) => {
  const newDate = new Date(date);
  const day = formatNumber(newDate.getDate());
  const month = formatNumber(newDate.getMonth() + 1);
  const year = formatNumber(newDate.getYear());
  const hours = formatNumber(newDate.getHours());
  const minutes = formatNumber(newDate.getMinutes());
  const seconds = formatNumber(newDate.getSeconds());

  return `${day}/${month}/${year} ${hours}/${minutes}/${seconds}`;
};

export const getBirthdayDate = (date) => {
  const newDate = new Date(date);
  const day = formatNumber(newDate.getDate());
  const month = formatNumber(newDate.getMonth() + 1);
  const year = formatNumber(newDate.getYear());

  return `${day}/${month}/${year}`;
};

export const formatCardNumber = (cardNumber) => `${cardNumber.slice(0, 2)}********${cardNumber.slice(-4)}`;

const getOrdersOfUsers = (users, orders) => {
  const usersIds = users.map((user) => user.id);
  const ordersOfUsers = orders.filter((order) => usersIds.includes(order.user_id));

  return ordersOfUsers;
};

export const getUsersOfOrders = (orders, users) => {
  const ordersUsersIds = orders.map((order) => order.user_id);
  const usersOfOrders = users.filter((user) => ordersUsersIds.includes(user.id));

  return usersOfOrders;
};

export const getStatistics = (orders, users) => {
  const males = users.filter((user) => user.gender === 'Male');
  const females = users.filter((user) => user.gender === 'Female');
  const maleOrders = getOrdersOfUsers(males, orders);
  const femaleOrders = getOrdersOfUsers(females, orders);
  const ordersSums = orders.map((order) => +order.total);
  const maleOrdersSums = maleOrders.map((order) => +order.total);
  const femaleOrdersSums = femaleOrders.map((order) => +order.total);

  const statistics = {};
  statistics.count = orders.length;
  statistics.total = _.sum(ordersSums);
  statistics.median = getMedian(ordersSums);
  statistics.average = getAverage(ordersSums);
  statistics.maleAverage = getAverage(maleOrdersSums);
  statistics.femaleAverage = getAverage(femaleOrdersSums);

  return statistics;
};

const getFilteredOrdersByValue = (orders, value) => {
  const filteredOrders = orders.filter((order) => (order.transaction_id.includes(value)
  || order.total.includes(value) || order.card_type.includes(value)
  || order.order_country.includes(value) || order.order_ip.includes(value)));
  return filteredOrders;
};

export const getFilteredOrders = (orders, users, value) => {
  const filteredUsers = users.filter((user) => user.first_name.includes(value)
   || user.last_name.includes(value));
  const filteredOrdersByName = getOrdersOfUsers(filteredUsers, orders);
  const filteredOrdersByValue = getFilteredOrdersByValue(orders, value);
  const filteredOrders = _.unionBy(filteredOrdersByName, filteredOrdersByValue, 'id');
  return filteredOrders;
};

const sortOrdersByDigitParam = (orders, param) => {
  const ordersWithDigitParam = orders.map((order) => ({ ...order, [param]: +order[param] }));
  const sortedWithDigitParam = _.sortBy(ordersWithDigitParam, param);
  return sortedWithDigitParam.map((order) => ({ ...order, [param]: String(order[param]) }));
};

export const getUserOfOrder = (users, order) => (
  users.filter((user) => user.id === order.user_id)[0]);

export const sortOrders = (sorting, orders, users) => {
  if (sorting.total) {
    return sortOrdersByDigitParam(orders, 'total');
  }

  if (sorting.created_at) {
    return sortOrdersByDigitParam(orders, 'created_at');
  }

  if (sorting.transaction_id) {
    return _.sortBy(orders, 'transaction_id');
  }

  if (sorting.card_type) {
    return _.sortBy(orders, 'card_type');
  }

  if (sorting.location) {
    return orders.sort(locationCompare);
  }

  if (sorting.user_name) {
    const ordersWithUserNames = orders.map((order) => {
      // eslint-disable-next-line camelcase
      const { first_name, last_name } = getUserOfOrder(users, order);
      return { ...order, first_name, last_name };
    });

    const sorted = ordersWithUserNames.sort(nameCompare);
    const result = sorted.map((order) => {
      delete order.first_name;
      delete order.last_name;
      return order;
    });
    return result;
  }

  return orders;
};
