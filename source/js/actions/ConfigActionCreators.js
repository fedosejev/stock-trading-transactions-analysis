var Dispatcher = require('../dispatcher/Dispatcher');

function setCurrency(currency) {
  var action = {
    type: 'set_currency',
    currency: currency
  };

  Dispatcher.dispatch(action);
}

function setCommissions(commissions) {
  var action = {
    type: 'set_commissions',
    commissions: commissions
  };

  Dispatcher.dispatch(action);
}

function setDateFormat(dateFormat) {
  var action = {
    type: 'set_date_format',
    dateFormat: dateFormat
  };

  Dispatcher.dispatch(action);
}

module.exports = {
  setCurrency: setCurrency,
  setCommissions: setCommissions,
  setDateFormat: setDateFormat
};