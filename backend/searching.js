function linearSearchByOrderId(data, orderId) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].order_id === orderId) {
      return data[i];
    }
  }
  return null;
}

module.exports = {
  linearSearchByOrderId
};
