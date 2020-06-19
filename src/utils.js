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
  // console.log(orders);
  const filteredOrders = orders.filter((order) => {
    return (order.transaction_id.includes(value) || order.total.includes(value)
     || order.card_type.includes(value) || order.order_country.includes(value) || order.order_ip.includes(value))
  });
  // console.log(filteredOrders);
  return filteredOrders;
};

export const getFilteredOrders = (orders, users, value) => {
  const filteredUsers = users.filter(user => user.first_name.includes(value) || user.last_name.includes(value));
  const filteredUsersIds = filteredUsers.map(user => user.id);
  const filteredOrdersByName = orders.filter(order => filteredUsersIds.includes(order.user_id));
  const filteredOrdersByValue = getFilteredOrdersByValue(orders, value);//.filter(order => filteredUsersIds.includes(order.user_id));
  const filteredOrders = _.unionBy(filteredOrdersByName, filteredOrdersByValue, 'id');
  // console.log(filteredOrders);
  return filteredOrders;
};

// export default orderDigitCompare = () => {

// };

// export const getFilteredOrders = 
const getUserNameShort = (users, id) => {
  const user = users.filter(user => user.id === id)[0];
  // const genderPrefix = user.gender === 'Male' ? 'Mr.': 'Ms.';

  return { first_name:user.first_name, last_name: user.last_name };
}

export const sortOrders = (sorting, orders, users) => {
  // const { sorting, orders } = this.state;
  
  if (sorting.total) {
    const correctOrders = orders.map(order => ({ ...order, 'total': +order.total, 'created_at': +order.created_at }));
    const sorted = _.sortBy(correctOrders, 'total');
    return sorted.map(order => ({ ...order, 'total': String(order.total), 'created_at': String(order.created_at) }));
    // this.setState({ orders: result });
  }

  if (sorting.created_at) {
    const correctOrders = orders.map(order => ({ ...order, 'total': +order.total, 'created_at': +order.created_at }));
    const sorted = _.sortBy(correctOrders, 'created_at');
    return sorted.map(order => ({ ...order, 'total': String(order.total), 'created_at': String(order.created_at) }));
    // const result = sorted.map(order => ({ ...order, 'total': String(order.total), 'created_at': String(order.created_at) }));
    // this.setState({ orders: result });
  }

  if (sorting.transaction_id) {
    const sorted = _.sortBy(orders, 'transaction_id');
    return sorted.map(order => ({ ...order, 'total': String(order.total), 'created_at': String(order.created_at) }));
    // const result = sorted.map(order => ({ ...order, 'total': String(order.total), 'created_at': String(order.created_at) }));
    // this.setState({ orders: sorted });
  }

  if (sorting.card_type) {
    return _.sortBy(orders, 'card_type');
    // const sorted = _.sortBy(orders, 'card_type');
    // const result = sorted.map(order => ({ ...order, 'total': String(order.total), 'created_at': String(order.created_at) }));
    // this.setState({ orders: sorted });
  }

  if (sorting.location) {
    const locationCompare = (a, b) => {
      if (a.order_country < b.order_country) {
        return -1;
      }
      if (a.order_country > b.order_country) {
        return 1;
      }

      if (a.order_ip < b.order_ip) {
        return -1;
      }
      if (a.order_ip > b.order_ip) {
        return 1;
      }

      return 0;
    }


    // const sorted = orders.sort(locationCompare);
    return orders.sort(locationCompare);
    // this.setState({ orders: sorted });
  }

  if (sorting.user) {
    const userCompare = (a, b) => {
      if (a.first_name < b.first_name) {
        return -1;
      }
      if (a.first_name > b.first_name) {
        return 1;
      }

      if (a.last_name < b.last_name) {
        return -1;
      }
      if (a.last_name > b.last_name) {
        return 1;
      }

      return 0;
    }

    const correctOrders = orders.map(order => {
      const {first_name, last_name} = getUserNameShort(users, order.user_id);
      return { ...order, first_name, last_name };
    });

    const sorted = correctOrders.sort(userCompare);
    const result = sorted.map(order => {
      delete order.first_name;
      delete order.last_name;
      return order;
    });
    return result;
    // this.setState({ orders: result });
  }
  
  return orders;
}