describe("Engine", function() {
  var Engine = require('../../source/js/engine');

  var engine;

  beforeEach(function() {
    engine = new Engine("$", 10);    
  });

  describe("#calculateProfitsOrLossesForEachStock", function() {

    describe("given valid input", function(){

      beforeEach(function(){

        // TODO: replace test objects data genration with a factory like https://github.com/rosiejs/rosie

        // var teslaBuyTransaction = {
        //   "Date": "01/11/2015",
        //   "Net value": 982.22,
        //   "Quantity": 7,
        //   "Stock code": "TSLA",
        //   "Type": "Bought",
        // };

        // var teslaSellTransaction = {
        //   "Date": "01/12/2015",
        //   "Net value": 1289.25,
        //   "Quantity": 7,
        //   "Stock code": "TSLA",
        //   "Type": "Sold",
        // };

        // var teslaTransactions = [teslaBuyTransaction, teslaSellTransaction];

        // this.input = [teslaTransactions];

        var buyTransaction1 = {
          "Date": "11/01/2015",
          "Net value": 906.79,
          "Quantity": 2,
          "Stock code": "AMZN",
          "Type": "Bought",
        };

        var buyTransaction2 = {
          "Date": "12/01/2015",
          "Net value": 2268.33,
          "Quantity": 6,
          "Stock code": "AMZN",
          "Type": "Bought",
        };

        var buyTransaction3 = {
          "Date": "13/01/2015",
          "Net value": 1764.69,
          "Quantity": 5,
          "Stock code": "AMZN",
          "Type": "Bought",
        };

        var sellTransaction4 = {
          "Date": "14/01/2015",
          "Net value": 4802.43,
          "Quantity": 12,
          "Stock code": "AMZN",
          "Type": "Sold",
        };

        ////////////
        
        var buyTransactionTSLA1 = {
          "Date": "11/01/2016",
          "Net value": 236.1999,
          "Quantity": 1,
          "Stock code": "TSLA",
          "Type": "Bought",
        };

        var buyTransactionTSLA2 = {
          "Date": "12/01/2016",
          "Net value": 218.92,
          "Quantity": 1,
          "Stock code": "TSLA",
          "Type": "Bought",
        };

        var buyTransactionTSLA3 = {
          "Date": "13/01/2016",
          "Net value": 401.84,
          "Quantity": 2,
          "Stock code": "TSLA",
          "Type": "Bought",
        };

        var buyTransactionTSLA4 = {
          "Date": "04/02/2016",
          "Net value": 339.34,
          "Quantity": 2,
          "Stock code": "TSLA",
          "Type": "Bought",
        };

        var buyTransactionTSLA5 = {
          "Date": "05/02/2016",
          "Net value": 169.37,
          "Quantity": 1,
          "Stock code": "TSLA",
          "Type": "Bought",
        };

        var sellTransactionTSLA1 = {
          "Date": "09/03/2016",
          "Net value": 630,
          "Quantity": 3,
          "Stock code": "TSLA",
          "Type": "Sold",
        };

        var sellTransactionTSLA2 = {
          "Date": "17/03/2016",
          "Net value": 445.702,
          "Quantity": 2,
          "Stock code": "TSLA",
          "Type": "Sold",
        };

        var sellTransactionTSLA3 = {
          "Date": "04/04/2016",
          "Net value": 490.8802,
          "Quantity": 2,
          "Stock code": "TSLA",
          "Type": "Sold",
        };
        

        /////////////

        var amazonTransactions = [buyTransaction1, buyTransaction2, buyTransaction3, sellTransaction4];
        var teslaTransactions = [buyTransactionTSLA1, buyTransactionTSLA2, buyTransactionTSLA3, buyTransactionTSLA4, buyTransactionTSLA5, sellTransactionTSLA1, sellTransactionTSLA2, sellTransactionTSLA3];
  
        // this.input = [amazonTransactions, teslaTransactions];
        this.input = [teslaTransactions, amazonTransactions];
        // this.input = [amazonTransactions];
      });

      it("should return the right result", function(){        

        var result = engine.calculateProfitsOrLossesForEachStock(this.input);
        
        expect(result.stocksGroupsResults.length).toEqual(2);

        var teslaCalculationResult = result.stocksGroupsResults[0]
        expect(teslaCalculationResult.transactions.length).toEqual(8);
        expect(teslaCalculationResult.resultPerformance.toFixed(1)).toEqual(120.91.toFixed(1));
        expect(teslaCalculationResult.symbolPerformance.toFixed(1)).toEqual(200.91.toFixed(1));        
        expect(teslaCalculationResult.commissionsAmount).toEqual(80);        

        var amazonCalculationResult = result.stocksGroupsResults[1]
        expect(amazonCalculationResult.transactions.length).toEqual(4);
        expect(amazonCalculationResult.resultPerformance.toFixed(1)).toEqual(276.0.toFixed(1));
        expect(amazonCalculationResult.symbolPerformance.toFixed(1)).toEqual(316.0.toFixed(1));        
        expect(amazonCalculationResult.commissionsAmount).toEqual(40);
        
        expect(result.totalPerformance.toFixed(1)).toEqual(516.92.toFixed(1));
        expect(result.overallPerformance.toFixed(1)).toEqual(396.925.toFixed(1));        
        expect(result.totalCommissions).toEqual(120);        
        
      });
    });

    describe("given invalid input", function() {
      it("should throw an error", function() {
        expect(engine.calculateProfitsOrLossesForEachStock).toThrow();
      });
    });

  });

});