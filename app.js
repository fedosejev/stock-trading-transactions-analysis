(function () {

  var FILE_NAME = '';
  var COMMISSION = 5.95;

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

  function convertCsvToJson(csv) {
    // Parse CSV string
    var result = Papa.parse(csv, {
      delimiter: ",",
      header: true,
      dynamicTyping: false
    });

    return result.data;
  }

  function removeCommaFromTheNetAmount(transactions) {
    return transactions.map(function (transaction) {
      transaction['Net value'] = transaction['Net value'].replace(',', '');
      return transaction;
    });
  }

  function calculateProfitsOrLossesForEachStock(stocks) {
    stocks.forEach(function (stockTransactions) {

      stockTransactions = removeCommaFromTheNetAmount(stockTransactions);

      console.log('Calculating ' + stockTransactions[0]['Stock code']);

      var totalPaidForAllShares = 0;
      var numberOfShares = 0;
      var minimumSharePricePaid = 0;

      var buyTransactions = [];
      var sellTransactions = [];

      var finalSellOutcome = 0;

      stockTransactions.forEach(function (transaction) {
        if (transaction['Type'] === 'Bought') {

          console.log('=== Bought ===');

          console.log(transaction);

          var netValuePaid = parseFloat(transaction['Net value']);
          var quantityBought = parseInt(transaction['Quantity']);
          var pricePaidPerShare = netValuePaid / quantityBought;

          buyTransactions.push({
            netValuePaid: netValuePaid,
            numberOfShares: quantityBought,
            pricePaidPerShare: pricePaidPerShare
          });

        } else if (transaction['Type'] === 'Sold') {

          console.log('buyTransactions:');
          console.log(buyTransactions);

          console.log('=== Sold ===');

          buyTransactions.sort(function compare(a, b) {
            if (a.pricePaidPerShare < b.pricePaidPerShare) {
              return -1;
            }

            if (a.pricePaidPerShare > b.pricePaidPerShare) {
              return 1;
            }

            return 0;
          });

          var quantitySold = parseInt(transaction['Quantity']);
          var sellOutcome = 0;

          for (var i = 0; i < buyTransactions.length; i++) {
            if (buyTransactions[i].numberOfShares === quantitySold) {

              console.debug('=');
              console.log('Need to sell: ', quantitySold);

              sellOutcome = sellOutcome + (parseFloat(transaction['Net value']) / parseInt(transaction['Quantity']) * quantitySold) - buyTransactions[i].netValuePaid;

              console.log('Actually sold: ' + quantitySold);

              console.debug(sellOutcome);

              buyTransactions[i].numberOfShares = buyTransactions[i].numberOfShares - quantitySold;
              break;

            } else if (buyTransactions[i].numberOfShares < quantitySold) {

              console.debug('<');
              console.log('Need to sell: ', quantitySold);

              quantitySold = quantitySold - buyTransactions[i].numberOfShares;

              console.log('Actually sold: ' + buyTransactions[i].numberOfShares);

              sellOutcome = sellOutcome + ((parseFloat(transaction['Net value']) / parseInt(transaction['Quantity'])) * buyTransactions[i].numberOfShares) - (buyTransactions[i].pricePaidPerShare * buyTransactions[i].numberOfShares);

              console.debug(sellOutcome);

              buyTransactions[i].numberOfShares = 0;

            } else if (buyTransactions[i].numberOfShares > quantitySold) { 

              console.debug('>');
              console.log('Need to sell: ', quantitySold);

              sellOutcome = sellOutcome + ((parseFloat(transaction['Net value']) / parseInt(transaction['Quantity'])) * quantitySold) - (buyTransactions[i].pricePaidPerShare * quantitySold);

              console.log('Actually sold: ' + quantitySold);

              console.debug(sellOutcome);

              buyTransactions[i].numberOfShares = buyTransactions[i].numberOfShares - quantitySold;
              break;
            
            }
          }

          finalSellOutcome = finalSellOutcome + sellOutcome;
          console.log('sellOutcome for ' + stockTransactions[0]['Stock code'] + ': ' + sellOutcome);

        }
      });

      console.debug('Final SELL outcome:');
      console.debug(finalSellOutcome);

    });
  }

  function handleFileContent(fileOnLoadEvent) {
    var csv = fileOnLoadEvent.target.result;
    var json;
    var stocks;
    var results;

    csv = fixCsvStringProducedByXO(csv);
    json = convertCsvToJson(csv);
    stocks = groupTradesByStock(json);

    console.log('Stocks:');
    console.log(stocks);

    calculateProfitsOrLossesForEachStock(stocks);

    results = stocks.map(tellWhatLossOrProfit);

    getTransactionsOverview(json);

    results.forEach(function (result) {
      renderStock(result);
    });
  }

  function getTransactionsOverview(trades) {
    console.log(trades);
  }

  function renderStock(stock) {
    var stockName = stock[0].split('.')[0];
    var stockResult = stock[1];
    var numberOfTrades = stock[2];
    var sharesHolding = stock[3];
    var maximumPricePaidPerShare = stock[4];

    var $stockContainer = $('<div class="stock"></div>');
    var $stockName = $('<div class="stock-name">' + stockName + '</div>');
    var $stockHolding = $('<div class="stock-holding">' + sharesHolding + ' shares</div>');
    var $stockResult = $('<div class="stock-result' + (stockResult > 0 ? ' profit' : ' loss') + '"><sup class="currency">£</sup>' + parseFloat(stockResult).toLocaleString() + '</div>');
    var $stockCommissions = $('<div class="stock-commissions"><small>Commissions (inc): £</small> ' + (numberOfTrades * COMMISSION).toFixed(2) + '</div>');
    var $maximumPricePaidPerShare = $('<div class="stock-maximum-price-per-share-paid"><small>Max share price paid: £</small> ' + maximumPricePaidPerShare.toFixed(2).toLocaleString() + '</div>');

    $stockContainer.append($stockName);
    $stockContainer.append($stockHolding);
    $stockContainer.append($stockResult);
    $stockContainer.append($stockCommissions);
    $stockContainer.append($maximumPricePaidPerShare);

    $('[data-app]').append($stockContainer);
  }

  function tellWhatLossOrProfit(stockTrades) {
    var result = 0;
    var sharesHolding = 0;
    var stockName = stockTrades[0]['Stock code'];
    var maximumPricePaidPerShare = 0;
    var pricePaidPerShare = 0;

    stockTrades.forEach(function (trade) {
      if (trade['Type'] === 'Bought') {
        result = result - parseFloat(trade['Net value'].replace(',', '')) - COMMISSION;
        sharesHolding = sharesHolding + parseInt(trade['Quantity'].replace(',', ''), 10);
        pricePaidPerShare = parseFloat(trade['Net value'].replace(',', '')) / parseFloat(trade['Quantity'].replace(',', ''));

        if (pricePaidPerShare > maximumPricePaidPerShare) {
          maximumPricePaidPerShare = pricePaidPerShare;
        }

      } else if (trade['Type'] === 'Sold') {
        result = result + parseFloat(trade['Net value'].replace(',', '')) - COMMISSION;
        sharesHolding = sharesHolding - parseInt(trade['Quantity'].replace(',', ''), 10);
      }
    });

    result = result.toFixed(2);

    return [stockName, result, stockTrades.length, sharesHolding, maximumPricePaidPerShare];
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

  function handleFileSelect(dropEvent) {
    dropEvent.stopPropagation();
    dropEvent.preventDefault();

    $('[data-app]').html('');
    $('body').removeClass('landing');

    var files = dropEvent.dataTransfer.files; // FileList object.
    var firstFile = files[0];

    FILE_NAME = firstFile.name.replace('.csv', '');

    var fileReader = new FileReader();
    fileReader.onload = handleFileContent;
    fileReader.readAsText(firstFile);
  }

  function handleDragOver(dragOverEvent) {
    dragOverEvent.stopPropagation();
    dragOverEvent.preventDefault();
    dragOverEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  function showLandingView() {
    document.querySelector('[data-landing]').classList.remove('hide');
  }

  function showLoadingView() {
    document.querySelector('[data-loading]').classList.remove('hide');
  }

  function hideLoadingView() {
    document.querySelector('[data-loading]').classList.add('hide');
  }

  document.addEventListener('DOMContentLoaded', function handleDOMContentLoaded() {
    var dropZoneElement = document.querySelector('html');
    dropZoneElement.addEventListener('dragover', handleDragOver, false);
    dropZoneElement.addEventListener('drop', handleFileSelect, false);
  });

})();