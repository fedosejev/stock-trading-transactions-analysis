var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('object-assign');

var currency = '£';
var commissions = 5.95;
var dateFormat = 'DD/MM/YYYY';

function setCurrency(thatCurrency) {
  currency = thatCurrency;

  StockTradesStore.emit('change');
}

function setCommissions(payCommissions) {
  commissions = payCommissions;

  StockTradesStore.emit('change');
}

function setDateFormat(format) {
  dateFormat = format;

  StockTradesStore.emit('change');
}

var StockTradesStore = objectAssign({}, EventEmitter.prototype, {
  
  getCurrency: function () {
    return currency;
  },

  getCommissions: function () {
    return commissions;
  },

  getDateFormat: function () {
    return dateFormat;
  },

  addChangeListener: function (changeEventHandler) {
    this.on('change', changeEventHandler);
  },

  removeChangeListener: function (changeEventHandler) {
    this.removeListener('change', changeEventHandler);
  }

});

function handleAction(action) {
  if (action.type === 'set_currency') {
    
    setCurrency(action.currency);
  
  } else if (action.type === 'set_commissions') {

    setCommissions(action.commissions);

  } else if (action.type === 'set_date_format') {

    setDateFormat(action.dateFormat);

  }
}

StockTradesStore.dispatchToken = Dispatcher.register(handleAction);

module.exports = StockTradesStore;