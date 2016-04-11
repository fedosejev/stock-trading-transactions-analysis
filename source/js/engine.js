function Engine(currencySign, commission) {
  this.currencySign = currencySign;
  this.commission = commission;
}

Engine.prototype.calculateProfitsOrLossesForEachStock = function(stocksGroups) {
  var self = this;

  // Input Validation
  if (!(typeof stocksGroups !== 'undefined' && stocksGroups.length > 0)) {
    throw new TypeError("stocks should be an array of nested arrays for each Stock Symbol");
  }

  var stocksGroupsResults = stocksGroups.map(function calculateForStock(stockGroup) {

    var transactions = self.calculateProfitsOrLossesForIndivifualStock(stockGroup);
    
    var symbolPerformance = transactions.filter(function(transaction) {
      return transaction['Type'] === 'Sold';
    }).reduce(function(total, transaction) {
      return parseFloat(total) + parseFloat(transaction.performance);
    }, 0);

    var commissionsAmount = transactions.reduce(function(total, transaction) {
      return parseFloat(total) + parseFloat(self.commission);
    }, 0);

    return {
      symbol: stockGroup[0]['Stock code'],
      transactions: transactions,
      symbolPerformance: symbolPerformance,
      commissionsAmount: commissionsAmount,
      resultPerformance: symbolPerformance - commissionsAmount,
    }
  });

  var totalPerformance = stocksGroupsResults.reduce(function sumOutcomes(total, transactionGroup) {
    return parseFloat(total) + parseFloat(transactionGroup.symbolPerformance);
  }, 0);

  var totalCommissions = stocksGroupsResults.reduce(function sumOutcomes(total, transactionGroup) {
    return parseFloat(total) + parseFloat(transactionGroup.commissionsAmount);
  }, 0);


  return { 
    stocksGroupsResults: stocksGroupsResults, 
    overallPerformance: totalPerformance - totalCommissions,
    totalPerformance: totalPerformance,
    totalCommissions: totalCommissions,
  }

};

Engine.prototype.calculateProfitsOrLossesForIndivifualStock = function(stockTransactions) {
  var STOCK_SYMBOL = stockTransactions[0]['Stock code'];

  return stockTransactions.map(function(transaction) { 

    if (transaction['Type'] === 'Bought')  {

    } else if (transaction['Type'] === 'Sold') {

      var sellTransaction = transaction;
      sellTransaction.performance = 0
      sellTransaction.pricePerShare = sellTransaction['Net value'] / sellTransaction['Quantity']

      stockTransactions.slice(0, stockTransactions.indexOf(sellTransaction)).sort(function(trans1, trans2) {

        var trans1PricePerShare = trans1['Net value'] / trans1['Quantity']
        var trans2PricePerShare = trans2['Net value'] / trans2['Quantity']
        return trans1PricePerShare > trans2PricePerShare

      }).forEach(function(trans) {
        if (trans['Type'] === 'Bought' && trans['Quantity'] != 0 && sellTransaction['Quantity'] != 0) {

          var sharesLeftToSell = sellTransaction['Quantity'] - trans['Quantity'];
          var sharesSold
          if (sharesLeftToSell <= 0) {
            sharesLeftToSell = 0
            sharesSold = sellTransaction['Quantity']
          } else {
            sharesSold = sellTransaction['Quantity'] - sharesLeftToSell
          }

          var sharesLeftInBoughtTransaction = trans['Quantity'] - sellTransaction['Quantity'];
          if (sharesLeftInBoughtTransaction < 0) {
            sharesLeftInBoughtTransaction = 0
          }

          var transPricePerShare = trans['Net value'] / trans['Quantity']

          sellTransaction.performance += (sellTransaction.pricePerShare * sharesSold) - (transPricePerShare * sharesSold)

          trans['Quantity'] = sharesLeftInBoughtTransaction;
          sellTransaction['Quantity'] = sharesLeftToSell;
          
        }
      });
    }

    return transaction;

  });


}

module.exports = Engine;
