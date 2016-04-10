var React = require('react');
var ConfigStore = require('../stores/ConfigStore');
var StockTradesStore = require('../stores/StockTradesStore');
var Engine = require('../engine');
var Utilities = require('../utilities');
var ChartEngine = require('../chart');

var OverallStockPerformanceGraph = React.createClass({
  
  componentDidMount: function () {
    var stockPerformances = StockTradesStore.getStockTrades().stockPerformances;
    var stockSymbols = Utilities.getListOfStockSymbols(stockPerformances);
    var stockPerformancesNumbers = Utilities.getListOfStockPerformanceNumbers(stockPerformances);
    var currency = ConfigStore.getCurrency();

    ChartEngine.renderBarChart(stockSymbols, stockPerformancesNumbers, currency);
  },

  render: function () {
    return (
      <div>
        <div className="overall-performance-graph" data-js-overall-performance-graph></div>
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>
    );
  }
});

module.exports = OverallStockPerformanceGraph;