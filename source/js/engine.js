var moment = require('moment');
var bankruptcy = require('./bankruptcy.json');

function isBankruptcyFiled(symbol) {
  symbol = symbol.split('.')[0];
  return (typeof bankruptcy[symbol] !== 'undefined');
}

function calculateProfitsOrLossesForEachStock(stocks, config) {

  var currencySign = config.currencySign;
  var commissions = config.commissions;
  var dateFormat = config.dateFormat;

  var overallSellOutcome = 0;
  var stocksSells = [];

  stocks.forEach(function calculateForStock(stockTransactions) {

    stockTransactions = stockTransactions.sort(function sortDates(a, b) {
      var date1 = moment(a['Date'], dateFormat);
      var date2 = moment(b['Date'], dateFormat);

      if (date1 < date2) {
        return -1;
      }
      
      if (date1 > date2) {
        return 1;
      }

      return 0;
    });

    var STOCK_SYMBOL = stockTransactions[0]['Stock code'];

    var stockSells = {
      symbol: STOCK_SYMBOL,
      sells: [],
      isBankruptcyFiled: isBankruptcyFiled(STOCK_SYMBOL),
      investedAmount: 0
    };

    console.log('\n\n\n\n🔮 Calculating ' + STOCK_SYMBOL + '\n\n');

    var totalPaidForAllShares = 0;
    var numberOfShares = 0;
    var minimumSharePricePaid = 0;

    var buyTransactions = [];
    var sellTransactions = [];

    var totalNumberOfSharesBoughtForThisStock = 0;
    var totalNumberOfSharesSoldForThisStock = 0;

    var finalSellOutcome = 0;

    stockTransactions.forEach(function calculateForTransaction(transaction) {
      if (transaction['Type'] === 'Bought') {

        console.log('=== Bought on ' + transaction['Date'] + ' ===');

        var netValuePaid = parseFloat(transaction['Net value']);
        var quantityBought = parseInt(transaction['Quantity']);
        var pricePaidPerShare = netValuePaid / quantityBought;

        var boughtTransaction = {
          netValuePaid: netValuePaid,
          numberOfShares: quantityBought,
          pricePaidPerShare: pricePaidPerShare,
          date: transaction['Date']
        };

        console.log(boughtTransaction);

        buyTransactions.push(boughtTransaction);

        totalNumberOfSharesBoughtForThisStock = totalNumberOfSharesBoughtForThisStock + quantityBought;

        stockSells.investedAmount = stockSells.investedAmount + netValuePaid;

      } else if (transaction['Type'] === 'Sold') {

        console.log('=== Sold on ' + transaction['Date'] + ' ===');

        var netValuePaid = parseFloat(transaction['Net value']);
        var quantitySold = parseInt(transaction['Quantity']);
        var pricePaidPerShare = netValuePaid / quantitySold;

        var soldTransaction = {
          netValuePaid: netValuePaid,
          numberOfShares: quantitySold,
          pricePaidPerShare: pricePaidPerShare,
          date: transaction['Date']
        };

        console.log(soldTransaction);

        sellTransactions.push(soldTransaction);

        totalNumberOfSharesSoldForThisStock = totalNumberOfSharesSoldForThisStock + quantitySold;

        stockSells.investedAmount = stockSells.investedAmount - netValuePaid;

        if (stockSells.investedAmount < 0) {
          stockSells.investedAmount = 0;
        }

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

            console.debug('Case: =');
            console.log('Need to sell:', quantitySold);

            var previousSellOutcome = sellOutcome;

            sellOutcome = sellOutcome + (parseFloat(transaction['Net value']) / parseInt(transaction['Quantity']) * quantitySold) - buyTransactions[i].netValuePaid;

            console.log('Actually sold:', quantitySold);

            console.debug((sellOutcome - previousSellOutcome).toFixed(2));

            buyTransactions[i].numberOfShares = buyTransactions[i].numberOfShares - quantitySold;
            break;

          } else if (buyTransactions[i].numberOfShares < quantitySold) {

            console.debug('Case: <');
            console.log('Need to sell:', quantitySold);

            quantitySold = quantitySold - buyTransactions[i].numberOfShares;

            console.log('Actually sold:', buyTransactions[i].numberOfShares);

            var previousSellOutcome = sellOutcome;

            sellOutcome = sellOutcome + ((parseFloat(transaction['Net value']) / parseInt(transaction['Quantity'])) * buyTransactions[i].numberOfShares) - (buyTransactions[i].pricePaidPerShare * buyTransactions[i].numberOfShares);

            console.debug((sellOutcome - previousSellOutcome).toFixed(2));

            buyTransactions[i].numberOfShares = 0;

          } else if (buyTransactions[i].numberOfShares > quantitySold) { 

            console.debug('Case: >');
            console.log('Need to sell:', quantitySold);

            var previousSellOutcome = sellOutcome;

            sellOutcome = sellOutcome + ((parseFloat(transaction['Net value']) / parseInt(transaction['Quantity'])) * quantitySold) - (buyTransactions[i].pricePaidPerShare * quantitySold);

            console.log('Actually sold:', quantitySold);

            console.debug((sellOutcome - previousSellOutcome).toFixed(2));

            buyTransactions[i].numberOfShares = buyTransactions[i].numberOfShares - quantitySold;
            break;
          
          }
        }

        finalSellOutcome = finalSellOutcome + sellOutcome;

        stockSells.sells.push({
          date: transaction['Date'],
          result: finalSellOutcome
        });

        console.log(stockSells);
      }
    });

    /*
      If you didn't sell or sold for what you bought it for, 
      then you have losses, because of commissions you paid (if any).
    */
    if (finalSellOutcome === 0 && commissions > 0) {
      finalSellOutcome = -(stockTransactions.length * commissions);
    }

    /*
      If bankruptcy was filed, then assume that everything that you've invested is lost.
    */
    if (stockSells.isBankruptcyFiled) {
      finalSellOutcome = -(stockSells.investedAmount);
    }

    console.debug('\n------------------');
    if (sellTransactions.length > 0) {
      console.debug('💰 Final result for ' +  STOCK_SYMBOL + ': ' + currencySign + finalSellOutcome.toFixed(2));
    } else {
      console.debug('💰 No final result for ' +  STOCK_SYMBOL + ', because you didn\'t sell ' +  STOCK_SYMBOL + ' yet.');
    }
    console.debug('------------------');

    overallSellOutcome = overallSellOutcome + finalSellOutcome;

    stockSells.overallResult = finalSellOutcome;
    stockSells.commissions = stockTransactions.length * commissions;
    stockSells.sharesHolding = totalNumberOfSharesBoughtForThisStock - totalNumberOfSharesSoldForThisStock;

    stocksSells.push(stockSells);
  });

  console.debug('\n\n=====================================================');
  console.debug('💰💰💰 Your overall trading results: ' + currencySign + overallSellOutcome.toFixed(2));
  console.debug('=====================================================\n\n\n');

  return stocksSells;
}

function calculatePerformanceAcrossAllStocks(stockPerformances) {
  return stockPerformances.reduce(function sumOutcomes(accumulator, currentValue) {
    return parseFloat(accumulator) + parseFloat(currentValue.overallResult);
  }, 0);
}

function calculateTotalCommissionsAcrossAllStocks(stockPerformances) {
  return stockPerformances.reduce(function sumOutcomes(accumulator, currentValue) {
    return parseFloat(accumulator) + parseFloat(currentValue.commissions);
  }, 0);
}

module.exports = {
  calculateProfitsOrLossesForEachStock: calculateProfitsOrLossesForEachStock,
  calculatePerformanceAcrossAllStocks: calculatePerformanceAcrossAllStocks,
  calculateTotalCommissionsAcrossAllStocks: calculateTotalCommissionsAcrossAllStocks
};