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
          "Date": "01/11/2015",
          "Net value": 906.79,
          "Quantity": 2,
          "Stock code": "AMZN",
          "Type": "Bought",
        };

        var buyTransaction2 = {
          "Date": "01/12/2015",
          "Net value": 2268.33,
          "Quantity": 6,
          "Stock code": "AMZN",
          "Type": "Bought",
        };

        var buyTransaction3 = {
          "Date": "01/13/2015",
          "Net value": 1764.69,
          "Quantity": 5,
          "Stock code": "AMZN",
          "Type": "Bought",
        };

        var sellTransaction4 = {
          "Date": "01/14/2015",
          "Net value": 4802.43,
          "Quantity": 12,
          "Stock code": "TSLA",
          "Type": "Sold",
        };

        var transactions = [buyTransaction1, buyTransaction2, buyTransaction3, sellTransaction4];
  
        this.input = [transactions];
      });

      it("should return the right result", function(){        
        expect(engine.calculateProfitsOrLossesForEachStock(this.input)).not.toBeNull();

        var result = engine.calculateProfitsOrLossesForEachStock(this.input);

        expect(result.overallSellOutcome.toFixed(1)).toEqual(276.015.toFixed(1));
        expect(result.totalCommissions).toEqual(40);
      });
    });

    describe("given invalid input", function() {
      it("should throw an error", function() {
        expect(engine.calculateProfitsOrLossesForEachStock).toThrow();
      });
    });

  });

});