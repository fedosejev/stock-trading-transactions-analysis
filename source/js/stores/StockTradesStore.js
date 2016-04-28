var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('object-assign');
var Engine = require('../engine');

var stockTrades = [];
var isCorruptedCsvData = false;

function setStockTrades(stocks) {
  if (typeof stocks.stockPerformances !== 'undefined') {
    stockTrades = stocks;
    StockTradesStore.emit('change');
  }
}

function setCorruptedCsvData() {
  isCorruptedCsvData = true;
}

var StockTradesStore = objectAssign({}, EventEmitter.prototype, {
  
  getStockTrades: function () {
    return stockTrades;
  },

  getIsCorruptedCsvData: function () {
    return isCorruptedCsvData;
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
  
  } else if (action.type === 'set_is_corrupted_csv_data') {

    setCorruptedCsvData();

  }
}

StockTradesStore.dispatchToken = Dispatcher.register(handleAction);

module.exports = StockTradesStore;