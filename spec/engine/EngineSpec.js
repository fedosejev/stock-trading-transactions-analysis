describe("Engine", function() {
  var Engine = require('../../source/js/engine');

  var engine;

  beforeEach(function() {
    engine = new Engine();    
  });

  describe("#calculateProfitsOrLossesForEachStock", function() {

    describe("valid input", function(){      
      it("should return the right result", function(){
        console.log(engine);
        expect(engine).not.toBeNil();
      });
    });

    describe("invalid input", function(){
      it("should throw an error");
    });

  });

});