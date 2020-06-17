import _ from 'lodash';

export const getOrderDate = (date) => {
  const formatNumber = (number) => number < 10 ? '0' + number : number;
  const newDate = new Date(date);
  const day = formatNumber(newDate.getDate());
  const month = formatNumber(newDate.getMonth() + 1);
  const year =  formatNumber(newDate.getYear());
  const hours = formatNumber(newDate.getHours());
  const minutes = formatNumber(newDate.getMinutes());
  const seconds = formatNumber(newDate.getSeconds());

  return `${day}/${month}/${year} ${hours}/${minutes}/${seconds}`;
};

export const formatCardNumber = (cardNumber) => {
  return cardNumber.slice(0, 2) + '********' + cardNumber.slice(-4);
};

export const getAverage = (arr) => {
  return _.sum(arr) / arr.length;
};

export const getMedian = (arr) => {
  const sorted = _.sortBy(arr);
  if (arr.length % 2 === 1) {
    const medianIndex = Math.ceil(arr.length / 2 );
    return sorted[medianIndex];
  }

  const middle = arr.length / 2;

  return (sorted[middle - 1] + sorted[middle]) / 2;
};

export const getStatistics = (orders, users) => {
  const malesIds = users.filter(user => user.gender === 'Male').map(user => user.id);
  const femalesIds = users.filter(user => user.gender === 'Female').map(user => user.id);
  const maleOrders = orders.filter(order => malesIds.includes(order.user_id));
  const femaleOrders = orders.filter(order => femalesIds.includes(order.user_id));
  const orderSums = orders.map(order => +order.total);
  const maleOrderSums = maleOrders.map(order => +order.total);
  const femaleOrderSums = femaleOrders.map(order => +order.total);
  const statistics = {};
  statistics.count = orders.length;
  statistics.total = _.sum(orderSums);
  statistics.median = getMedian(orderSums);
  statistics.average = getAverage(orderSums);
  statistics.maleAverage = getAverage(maleOrderSums);
  statistics.femaleAverage = getAverage(femaleOrderSums);

  return statistics;
};

export const getFilteredOrdersByValue = (orders, value) => {
  const filteredOrders = orders.filter(order => order.transaction_id.includes(value));
  if (filteredOrders.length == 0) {
    filteredOrders = orders.filter(order => order.total.includes(value));
  }
  return filteredOrders;
};