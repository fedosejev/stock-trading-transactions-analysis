var uuid = require('node-uuid');

function setUuidForEachStockPerformance(stockPerformances) {
  return stockPerformances.map(function (stockPerformance) {
    stockPerformance.id = uuid.v4();
    return stockPerformance;
  });
}

function getListOfStockSymbols(stockPerformances) {
  return stockPerformances
    .map(function getStockSymbol(stockPerformance) {
      return stockPerformance.symbol.split('.')[0];
    });
}

function getListOfStockPerformanceNumbers(stockPerformances) {
  return stockPerformances
    .map(function getStockSymbol(stockPerformance) {
      return stockPerformance.overallResult;
    });
}

function getListOfProfitableStockSymbols(stockPerformances) {
  return stockPerformances
    .filter(function filterOutNegativeResult(stockPerformance) {
      return (stockPerformance.overallResult >= 0);
    })
    .map(function getStockSymbol(stockPerformance) {
      return stockPerformance.symbol.split('.')[0];
    });
}

function getListOfProfitableStockPerformanceNumbers(stockPerformances) {
  return stockPerformances
    .filter(function filterOutNegativeResult(stockPerformance) {
      return (stockPerformance.overallResult >= 0);
    })
    .map(function getStockSymbol(stockPerformance) {
      return stockPerformance.overallResult;
    });
}

function getOnlyProfitableStocks(stockPerformances) {
  return stockPerformances
    .filter(function filterOutNegativeResult(stockPerformance) {
      return (stockPerformance.overallResult >= 0);
    });
}

module.exports = {
  setUuidForEachStockPerformance: setUuidForEachStockPerformance,
  getOnlyProfitableStocks: getOnlyProfitableStocks,
  getListOfStockSymbols: getListOfStockSymbols,
  getListOfStockPerformanceNumbers: getListOfStockPerformanceNumbers,
  getListOfProfitableStockSymbols: getListOfProfitableStockSymbols,
  getListOfProfitableStockPerformanceNumbers: getListOfProfitableStockPerformanceNumbers
};