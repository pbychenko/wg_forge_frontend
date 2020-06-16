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
  // console.log(sorted);
  if (arr.length % 2 === 1) {
    const medianIndex = Math.ceil(arr.length / 2 );
    return sorted[medianIndex];
  }

  const middle = arr.length / 2;

  return (sorted[middle - 1] + sorted[middle]) / 2;
};