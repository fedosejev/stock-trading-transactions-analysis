var Dispatcher = require('../dispatcher/Dispatcher');
var FileHandler = require('../file-handler');
var CsvParser = require('../csv-parser');
var Engine = require('../engine');
var Utilities = require('../utilities');
var ConfigStore = require('../stores/ConfigStore');

function calculateStockPerformances(stocks) {
  return new Promise(function (resolve, reject) {

    var engineConfig = {
      currencySign: ConfigStore.getCurrency(),
      commissions: ConfigStore.getCommissions()
    };

    var stockPerformances = Engine.calculateProfitsOrLossesForEachStock(stocks, engineConfig);
    var overallPerformance = Engine.calculatePerformanceAcrossAllStocks(stockPerformances);
    var totalCommissions = Engine.calculateTotalCommissionsAcrossAllStocks(stockPerformances);
    
    stockPerformances = Utilities.setUuidForEachStockPerformance(stockPerformances);

    resolve({
      stockPerformances: stockPerformances,
      overallPerformance: overallPerformance,
      totalCommissions: totalCommissions
    });

  });
}

function setStockTrades(stockTrades) {
  var action = {
    type: 'set_stock_trades',
    stockTrades: stockTrades
  };

  Dispatcher.dispatch(action);
}

function reportError(error) {    
  var action = {
    type: 'error_reading_csv_file',
    error: error
  };

  console.error(error);

  Dispatcher.dispatch(action);
}

function readFirstFile(files) {
  FileHandler
    .readFirstCsvFile(files)
    .then(CsvParser.convertCsvToJson)
    .then(CsvParser.groupTradesByStock)
    .then(calculateStockPerformances)
    .then(setStockTrades)
    .catch(reportError);
}

function analyseJsonData(data) {
  CsvParser
    .groupTradesByStock(data)
    .then(calculateStockPerformances)
    .then(setStockTrades)
    .catch(reportError);
}

module.exports = {
  readFirstFile: readFirstFile,
  analyseJsonData: analyseJsonData
};