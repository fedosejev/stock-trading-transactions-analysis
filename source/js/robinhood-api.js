var jquery = require('jquery');

function getOrders(config, callback) {
  var request = jquery.ajax({
    url: 'http://163.172.150.107:8888/api/robinhood/orders',
    method: 'post',
    data: {
      username: config.username,
      password: config.password
    },
    dataType: 'json'
  });

  request.done(function (response) {
    console.log(response);
    callback(null, response);
  });

  request.fail(function (error) {
    console.error(error);
    callback(error);
  });
}

module.exports = {
  getOrders: getOrders
};