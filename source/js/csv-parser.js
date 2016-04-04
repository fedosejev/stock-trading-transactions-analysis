function convertCsvToJson(csv) {
  // Parse CSV string
  var result = Papa.parse(csv, {
    delimiter: ",",
    header: true,
    dynamicTyping: false
  });

  return result.data;
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

function removeCommaFromTheNetAmount(transactions) {
  // Convert 4,567.88 to 4567.88
  return transactions.map(function (transaction) {
    transaction['Net value'] = transaction['Net value'].replace(',', '');
    return transaction;
  });
}

function cleanStocksTransactions(stocks) {
  return stocks.map(function calculateForStock(stockTransactions) {
    return removeCommaFromTheNetAmount(stockTransactions);
  });
}

function groupTradesByStock(trades) {
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

  return results;
}

module.exports = {
  convertCsvToJson: convertCsvToJson,
  fixCsvStringProducedByXO: fixCsvStringProducedByXO,
  removeCommaFromTheNetAmount: removeCommaFromTheNetAmount,
  cleanStocksTransactions: cleanStocksTransactions,
  groupTradesByStock: groupTradesByStock
};