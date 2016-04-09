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

        var teslaBuyTransaction = {
          "Date": "01/11/2015",
          "Net value": 982.22,
          "Quantity": 7,
          "Stock code": "TSLA",
          "Type": "Bought",
        };

        var teslaSellTransaction = {
          "Date": "01/12/2015",
          "Net value": 1289.25,
          "Quantity": 7,
          "Stock code": "TSLA",
          "Type": "Sold",
        };

        var teslaTransactions = [teslaBuyTransaction, teslaSellTransaction];

        this.input = [teslaTransactions];
      });

      it("should return the right result", function(){        
        expect(engine.calculateProfitsOrLossesForEachStock(this.input)).not.toBeNull();

        var result = engine.calculateProfitsOrLossesForEachStock(this.input);

        expect(result.overallSellOutcome).toEqual(287.03);
        expect(result.totalCommissions).toEqual(20);
      });
    });

    describe("given invalid input", function() {
      it("should throw an error", function() {
        expect(engine.calculateProfitsOrLossesForEachStock).toThrow();
      });
    });

  });

});