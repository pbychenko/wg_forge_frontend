/* eslint-disable no-param-reassign */
import _ from 'lodash';

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

const formatNumber = (number) => (number < 10 ? `0${number}` : `${number}`);

const getTimeStamp = (date) => {
  const newDate = new Date(date);
  const hours = formatNumber(newDate.getHours());
  const minutes = formatNumber(newDate.getMinutes());
  const seconds = formatNumber(newDate.getSeconds());

  return `${hours}/${minutes}/${seconds}`;
};

const getOrdersOfUsers = (users, orders) => {
  const ordersOfUsers = orders.filter((order) => users.some(({ id }) => id === order.user_id));

  return ordersOfUsers;
};

export const getFullUserName = ({ gender, first_name, last_name }) => {
  const genderPrefix = gender === 'Male' ? 'Mr.' : 'Ms.';

  return `${genderPrefix} ${first_name} ${last_name}`;
};

export const getBirthdayDate = (date) => {
  const newDate = new Date(date);
  const day = formatNumber(newDate.getDate());
  const month = formatNumber(newDate.getMonth() + 1);
  const year = formatNumber(newDate.getYear());

  return `${day}/${month}/${year}`;
};

export const getOrderDate = (date) => `${getBirthdayDate(date)} ${getTimeStamp(date)}`;

export const formatCardNumber = (cardNumber) => `${cardNumber.slice(0, 2)}********${cardNumber.slice(-4)}`;

export const getUsersOfOrders = (orders, users) => {
  const usersOfOrders = users.filter((user) => orders.some((order) => order.user_id === user.id));

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

  const statistics = {
    count: orders.length,
    total: _.sum(ordersSums),
    median: getMedian(ordersSums),
    average: getAverage(ordersSums),
    maleAverage: getAverage(maleOrdersSums),
    femaleAverage: getAverage(femaleOrdersSums),
  };

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

const sortOrdersByDigitParam = (orders, param, direction) => {
  if (direction === 'asc') {
    return orders.sort(((a, b) => a[param] - b[param]));
  }
  return orders.sort(((a, b) => b[param] - a[param]));
};

export const getUserOfOrder = (users, order) => (
  users.filter((user) => user.id === order.user_id)[0]);

export const sortOrders = (sorting, orders, users) => {
  if (sorting.by === 'total' || sorting.by === 'created_at') {
    return sortOrdersByDigitParam(orders, sorting.by, sorting.direction);
  }

  if (sorting.by === 'transaction_id' || sorting.by === 'card_type') {
    return _.orderBy(orders, sorting.by, sorting.direction);
  }

  if (sorting.by === 'location') {
    return _.orderBy(orders, ['order_country', 'order_ip'], [sorting.direction, sorting.direction]);
  }

  if (sorting.by === 'user_name') {
    const ordersWithUserNames = orders.map((order) => {
      // eslint-disable-next-line camelcase
      const { first_name, last_name } = getUserOfOrder(users, order);
      return { ...order, first_name, last_name };
    });

    const sorted = _.orderBy(ordersWithUserNames, ['first_name', 'last_name'], [sorting.direction, sorting.direction]);
    const result = sorted.map((order) => {
      delete order.first_name;
      delete order.last_name;
      return order;
    });
    return result;
  }

  return orders;
};
