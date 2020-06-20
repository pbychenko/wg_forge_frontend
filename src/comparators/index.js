export const locationCompare = (a, b) => {
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
};

export const nameCompare = (a, b) => {
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
};
