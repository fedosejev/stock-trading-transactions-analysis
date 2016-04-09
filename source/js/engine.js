function Engine(currencySign, commission) {
  this.currencySign = currencySign;
  this.commission = commission;
}

Engine.prototype.calculateProfitsOrLossesForEachStock = function(stocks) {
  var self = this;

  console.log("stocks input format");
  console.log(stocks);

  var overallSellOutcome = 0;
  var stocksSells = [];

  stocks.forEach(function calculateForStock(stockTransactions) {

    var STOCK_SYMBOL = stockTransactions[0]['Stock code'];

    var stockSells = {
      symbol: STOCK_SYMBOL,
      sells: []
    };

    console.log('\n\n\n\n🔮 Calculating ' + STOCK_SYMBOL + '\n\n');

    var totalPaidForAllShares = 0;
    var numberOfShares = 0;
    var minimumSharePricePaid = 0;

    var buyTransactions = [];
    var sellTransactions = [];

    var finalSellOutcome = 0;

    stockTransactions.forEach(function calculateForTransaction(transaction) {
      if (transaction['Type'] === 'Bought') {

        console.log('=== Bought ===');

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

      } else if (transaction['Type'] === 'Sold') {

        console.log('=== Sold ===');

        var netValuePaid = parseFloat(transaction['Net value']);
        var quantityBought = parseInt(transaction['Quantity']);
        var pricePaidPerShare = netValuePaid / quantityBought;

        var soldTransaction = {
          netValuePaid: netValuePaid,
          numberOfShares: quantityBought,
          pricePaidPerShare: pricePaidPerShare,
          date: transaction['Date']
        };

        console.log(soldTransaction);

        sellTransactions.push(soldTransaction);

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

            console.log('Case: =');
            console.log('Need to sell:', quantitySold);

            var previousSellOutcome = sellOutcome;

            sellOutcome = sellOutcome + (parseFloat(transaction['Net value']) / parseInt(transaction['Quantity']) * quantitySold) - buyTransactions[i].netValuePaid;

            console.log('Actually sold:', quantitySold);

            console.log((sellOutcome - previousSellOutcome).toFixed(2));

            buyTransactions[i].numberOfShares = buyTransactions[i].numberOfShares - quantitySold;
            break;

          } else if (buyTransactions[i].numberOfShares < quantitySold) {

            console.log('Case: <');
            console.log('Need to sell:', quantitySold);

            quantitySold = quantitySold - buyTransactions[i].numberOfShares;

            console.log('Actually sold:', buyTransactions[i].numberOfShares);

            var previousSellOutcome = sellOutcome;

            sellOutcome = sellOutcome + ((parseFloat(transaction['Net value']) / parseInt(transaction['Quantity'])) * buyTransactions[i].numberOfShares) - (buyTransactions[i].pricePaidPerShare * buyTransactions[i].numberOfShares);

            console.log((sellOutcome - previousSellOutcome).toFixed(2));

            buyTransactions[i].numberOfShares = 0;

          } else if (buyTransactions[i].numberOfShares > quantitySold) { 

            console.log('Case: >');
            console.log('Need to sell:', quantitySold);

            var previousSellOutcome = sellOutcome;

            sellOutcome = sellOutcome + ((parseFloat(transaction['Net value']) / parseInt(transaction['Quantity'])) * quantitySold) - (buyTransactions[i].pricePaidPerShare * quantitySold);

            console.log('Actually sold:', quantitySold);

            console.log((sellOutcome - previousSellOutcome).toFixed(2));

            buyTransactions[i].numberOfShares = buyTransactions[i].numberOfShares - quantitySold;
            break;

          }
        }

        finalSellOutcome = finalSellOutcome + sellOutcome;

        stockSells.sells.push({
          date: transaction['Date'],
          result: finalSellOutcome
        });
      }
    });

    console.log('\n------------------');
    if (sellTransactions.length > 0) {
      console.log('💰 Final result for ' +  STOCK_SYMBOL + ': ' + self.currencySign + finalSellOutcome.toFixed(2));
    } else {
      console.log('💰 No final result for ' +  STOCK_SYMBOL + ', because you didn\'t sell ' +  STOCK_SYMBOL + ' yet.');
    }
    console.log('------------------');

    overallSellOutcome = overallSellOutcome + finalSellOutcome;

    stockSells.overallResult = finalSellOutcome.toFixed(2);
    stockSells.commissions = stockTransactions.length * self.commission;
    stockSells.overallResult = stockSells.overallResult - stockSells.commissions;

    stocksSells.push(stockSells);
  });

  var totalCommissions = stocksSells.reduce(function sumOutcomes(accumulator, currentValue) {
    return parseFloat(accumulator) + parseFloat(currentValue.commissions);
  }, 0);

  console.log('\n\n=====================================================');
  console.log('💰💰💰 Your overall trading results: ' + self.currencySign + overallSellOutcome.toFixed(2));
  console.log('=====================================================\n\n\n');

  return { stockSells: stocksSells, overallSellOutcome: overallSellOutcome - totalCommissions, totalCommissions: totalCommissions };
};

module.exports = Engine;

// function calculateProfitsOrLossesForEachStock(stocks) {

//   console.log("stocks input format");
//   console.log(stocks);

//   var overallSellOutcome = 0;
//   var stocksSells = [];

//   stocks.forEach(function calculateForStock(stockTransactions) {

//     var STOCK_SYMBOL = stockTransactions[0]['Stock code'];

//     var stockSells = {
//       symbol: STOCK_SYMBOL,
//       sells: []
//     };

//     console.log('\n\n\n\n🔮 Calculating ' + STOCK_SYMBOL + '\n\n');

//     var totalPaidForAllShares = 0;
//     var numberOfShares = 0;
//     var minimumSharePricePaid = 0;

//     var buyTransactions = [];
//     var sellTransactions = [];

//     var finalSellOutcome = 0;

//     stockTransactions.forEach(function calculateForTransaction(transaction) {
//       if (transaction['Type'] === 'Bought') {

//         console.log('=== Bought ===');

//         var netValuePaid = parseFloat(transaction['Net value']);
//         var quantityBought = parseInt(transaction['Quantity']);
//         var pricePaidPerShare = netValuePaid / quantityBought;

//         var boughtTransaction = {
//           netValuePaid: netValuePaid,
//           numberOfShares: quantityBought,
//           pricePaidPerShare: pricePaidPerShare,
//           date: transaction['Date']
//         };

//         console.log(boughtTransaction);

//         buyTransactions.push(boughtTransaction);

//       } else if (transaction['Type'] === 'Sold') {

//         console.log('=== Sold ===');

//         var netValuePaid = parseFloat(transaction['Net value']);
//         var quantityBought = parseInt(transaction['Quantity']);
//         var pricePaidPerShare = netValuePaid / quantityBought;

//         var soldTransaction = {
//           netValuePaid: netValuePaid,
//           numberOfShares: quantityBought,
//           pricePaidPerShare: pricePaidPerShare,
//           date: transaction['Date']
//         };

//         console.log(soldTransaction);

//         sellTransactions.push(soldTransaction);

//         buyTransactions.sort(function compare(a, b) {
//           if (a.pricePaidPerShare < b.pricePaidPerShare) {
//             return -1;
//           }

//           if (a.pricePaidPerShare > b.pricePaidPerShare) {
//             return 1;
//           }

//           return 0;
//         });

//         var quantitySold = parseInt(transaction['Quantity']);
//         var sellOutcome = 0;

//         for (var i = 0; i < buyTransactions.length; i++) {
//           if (buyTransactions[i].numberOfShares === quantitySold) {

//             console.log('Case: =');
//             console.log('Need to sell:', quantitySold);

//             var previousSellOutcome = sellOutcome;

//             sellOutcome = sellOutcome + (parseFloat(transaction['Net value']) / parseInt(transaction['Quantity']) * quantitySold) - buyTransactions[i].netValuePaid;

//             console.log('Actually sold:', quantitySold);

//             console.log((sellOutcome - previousSellOutcome).toFixed(2));

//             buyTransactions[i].numberOfShares = buyTransactions[i].numberOfShares - quantitySold;
//             break;

//           } else if (buyTransactions[i].numberOfShares < quantitySold) {

//             console.log('Case: <');
//             console.log('Need to sell:', quantitySold);

//             quantitySold = quantitySold - buyTransactions[i].numberOfShares;

//             console.log('Actually sold:', buyTransactions[i].numberOfShares);

//             var previousSellOutcome = sellOutcome;

//             sellOutcome = sellOutcome + ((parseFloat(transaction['Net value']) / parseInt(transaction['Quantity'])) * buyTransactions[i].numberOfShares) - (buyTransactions[i].pricePaidPerShare * buyTransactions[i].numberOfShares);

//             console.log((sellOutcome - previousSellOutcome).toFixed(2));

//             buyTransactions[i].numberOfShares = 0;

//           } else if (buyTransactions[i].numberOfShares > quantitySold) { 

//             console.log('Case: >');
//             console.log('Need to sell:', quantitySold);

//             var previousSellOutcome = sellOutcome;

//             sellOutcome = sellOutcome + ((parseFloat(transaction['Net value']) / parseInt(transaction['Quantity'])) * quantitySold) - (buyTransactions[i].pricePaidPerShare * quantitySold);

//             console.log('Actually sold:', quantitySold);

//             console.log((sellOutcome - previousSellOutcome).toFixed(2));

//             buyTransactions[i].numberOfShares = buyTransactions[i].numberOfShares - quantitySold;
//             break;

//           }
//         }

//         finalSellOutcome = finalSellOutcome + sellOutcome;

//         stockSells.sells.push({
//           date: transaction['Date'],
//           result: finalSellOutcome
//         });
//       }
//     });

//     console.log('\n------------------');
//     if (sellTransactions.length > 0) {
//       console.log('💰 Final result for ' +  STOCK_SYMBOL + ': ' + CURRENCY_SIGN + finalSellOutcome.toFixed(2));
//     } else {
//       console.log('💰 No final result for ' +  STOCK_SYMBOL + ', because you didn\'t sell ' +  STOCK_SYMBOL + ' yet.');
//     }
//     console.log('------------------');

//     overallSellOutcome = overallSellOutcome + finalSellOutcome;

//     stockSells.overallResult = finalSellOutcome.toFixed(2);
//     stockSells.commissions = stockTransactions.length * COMMISSION;
//     stockSells.overallResult = stockSells.overallResult - stockSells.commissions;

//     stocksSells.push(stockSells);
//   });

//   console.log('\n\n=====================================================');
//   console.log('💰💰💰 Your overall trading results: ' + CURRENCY_SIGN + overallSellOutcome.toFixed(2));
//   console.log('=====================================================\n\n\n');

//   return stocksSells;
// }

// module.exports = {
//   calculateProfitsOrLossesForEachStock: calculateProfitsOrLossesForEachStock
// };