var React = require('react');
var ConfigStore = require('../stores/ConfigStore');
var StockTradesStore = require('../stores/StockTradesStore');
var Engine = require('../engine');
var Utilities = require('../utilities');
var Chart = require('../chart');

var Dygraphs = require('dygraphs');

var OverallStockPerformanceGraph = React.createClass({
  
  componentDidMount: function () {
    var stockPerformances = StockTradesStore.getStockTrades().stockPerformances;
    var stockSymbols = Utilities.getListOfStockSymbols(stockPerformances);
    var stockPerformancesNumbers = Utilities.getListOfStockPerformanceNumbers(stockPerformances);
    var currency = ConfigStore.getCurrency();

    Chart.renderBarChart(stockSymbols, stockPerformancesNumbers, currency);

    var graph = new Dygraph(document.querySelector('[data-js-overall-trading-graph]'), csv);
  },

  render: function () {
    return (
      <div>
        <div className="overall-performance-graph" data-js-overall-performance-graph></div>
        <div className="overall-performance-graph" data-js-overall-trading-graph></div>
      </div>
    );
  }
});

module.exports = OverallStockPerformanceGraph;