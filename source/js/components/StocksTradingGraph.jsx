var React = require('react');
var ConfigStore = require('../stores/ConfigStore');
var StockTradesStore = require('../stores/StockTradesStore');
var Engine = require('../engine');
var Utilities = require('../utilities');
var Chart = require('../chart');

var Dygraphs = require('dygraphs');

var StocksTradingGraph = React.createClass({
  
  componentDidMount: function () {
    var stockPerformances = StockTradesStore.getStockTrades().stockPerformances;
    var stockSymbols = Utilities.getListOfStockSymbols(stockPerformances);
    var stockPerformancesNumbers = Utilities.getListOfStockPerformanceNumbers(stockPerformances);
    var currency = ConfigStore.getCurrency();

    Chart.renderLineChart(stockSymbols, stockPerformancesNumbers, currency);

  //   var graph = new Dygraph(document.querySelector('[]'),

  //   // CSV or path to a CSV file.
  //   "Date,Temperature\n" +
  //   "2008-05-07,75\n" +
  //   "2008-05-08,70\n" +
  //   "2008-05-09,80\n"

  // );
  },

  render: function () {
    return (
      <div className="stocks-trading-graph" data-js-stocks-trading-graph></div>
      <div className="stocks-trading-graph" data-js-stocks-trading-graph></div>
    );
  }
});

module.exports = StocksTradingGraph;