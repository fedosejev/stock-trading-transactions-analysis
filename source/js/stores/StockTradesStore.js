var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('object-assign');
var Engine = require('../engine');

var stockTrades = [];

function setStockTrades(stocks) {
  if (typeof stocks.stockPerformances !== 'undefined') {
    stockTrades = stocks;
    StockTradesStore.emit('change');
  }
}

var StockTradesStore = objectAssign({}, EventEmitter.prototype, {
  
  getStockTrades: function () {
    return stockTrades;
  },

  addChangeListener: function (changeEventHandler) {
    this.on('change', changeEventHandler);
  },

  removeChangeListener: function (changeEventHandler) {
    this.removeListener('change', changeEventHandler);
  }

});

function handleAction(action) {
  if (action.type === 'set_stock_trades') {

    setStockTrades(action.stockTrades);
  
  }
}

StockTradesStore.dispatchToken = Dispatcher.register(handleAction);

module.exports = StockTradesStore;