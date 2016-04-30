var Papa = require('papaparse');
var adapter = require('./adapters/adapter');

function convertCsvToJson(csv) {
  return new Promise(function (resolve, reject) {

    csv = removeCommaBeforeNewLineCharacter(csv); // Robinhood
    csv = removeCommaFromNumbers(csv); // X-O
    csv = removeDoubleQuoteCharacters(csv); // X-O
    csv = csv.trim(); // General

    var results = Papa.parse(csv, {
      delimiter: ",",
      header: true,
      dynamicTyping: true
    });

    if (results.errors.length > 0) {
      reject(results.errors);
      return;
    }

    var data = adapter.adapt(results.data);

    console.log('data:');
    console.log(data);

    resolve(data);

  });
}

function removeCommaBeforeNewLineCharacter(csvString) {
  return csvString.replace(/(,\n)/g, '\n');
}

function removeCommaFromNumbers(csvString) {
  return csvString.replace(/"(\d+),(\d+)/g, '"$1$2');
}

function removeDoubleQuoteCharacters(csvString) {
  return csvString.replace(/(")+/g, '');
}

function fixCsvStringProducedByXO(csvString) {
  var iterator;
  var character;
  var fixedCsv = [];
  var csvArray = csvString.trim().split('');
  var isQuoteOpened = false;

  for (iterator = 0; iterator < csvArray.length; iterator++) {
    character = csvArray[iterator];

    if (character === '"' && !isQuoteOpened) {
      isQuoteOpened = true;
    } else if (character === '"' && isQuoteOpened) {
      isQuoteOpened = false;
    }

    if (character === '\n') {

      if (csvArray[iterator + 1] !== '"') {
        fixedCsv.push(character);
        fixedCsv.push('"');
      }
    
    } else if (character === ',' && !isQuoteOpened) {
      
      if (csvArray[iterator - 1] !== '"') {
        fixedCsv.push('"');
      }

      fixedCsv.push(character);

      if (csvArray[iterator + 1] !== '"') {
        fixedCsv.push('"');
      }
    
    } else {

      fixedCsv.push(character);
    
    }
  }

  return fixedCsv.join('');
}

function groupTradesByStock(trades) {
  return new Promise(function (resolve, reject) {

    var results = [];
    var stocks = {};
    var stock;

    trades.forEach(function (trade) {
      stock = stocks[trade['Stock code']];

      if (stock) {
        stock.push(trade);
      } else {
        stocks[trade['Stock code']] = [trade];
      }
    });

    Object.keys(stocks).forEach(function (stockName) {
      results.push(stocks[stockName]);
    });

    resolve(results);

  });
}

module.exports = {
  convertCsvToJson: convertCsvToJson,
  groupTradesByStock: groupTradesByStock
};