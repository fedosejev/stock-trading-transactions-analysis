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
      commissions: ConfigStore.getCommissions(),
      dateFormat: ConfigStore.getDateFormat()
    };

    var stockPerformances = Engine.calculateProfitsOrLossesForEachStock(stocks, engineConfig);
    var overallPerformance = Engine.calculatePerformanceAcrossAllStocks(stockPerformances);
    var totalCommissions = Engine.calculateTotalCommissionsAcrossAllStocks(stockPerformances);
    
    stockPerformances = Utilities.setUuidForEachStockPerformance(stockPerformances);

    var isCorruptedCsvData = ! stockPerformances.every(function isNumberOfSharesHoldingNotNegative(stockPerformance) {
      return (stockPerformance.sharesHolding >= 0);
    });

    if (isCorruptedCsvData) {
      setIsCorruptedCsvData();
    }

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

function setIsCorruptedCsvData() {
  var action = {
    type: 'set_is_corrupted_csv_data'
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

function parseCsvData(csv) {
  CsvParser
    .convertCsvToJson(csv)
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
  parseCsvData: parseCsvData,
  readFirstFile: readFirstFile,
  analyseJsonData: analyseJsonData,
  setIsCorruptedCsvData: setIsCorruptedCsvData
};