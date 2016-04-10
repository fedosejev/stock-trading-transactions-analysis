var React = require('react');
var StockTradesStore = require('../stores/StockTradesStore');
var StockPerformance = require('../components/StockPerformance.jsx');
var OverallStockPerformance = require('../components/OverallStockPerformance.jsx');
var OverallStockPerformanceGraph = require('../components/OverallStockPerformanceGraph.jsx');
var AnalyticsFooter = require('./AnalyticsFooter.jsx');

var Analysis = React.createClass({
  
  getInitialState: function () {
    return {
      stockTrades: StockTradesStore.getStockTrades()
    };
  },

  getStockTrades: function () {
    this.setState({
      stockTrades: StockTradesStore.getStockTrades()
    });
  },

  componentDidMount: function () {
    StockTradesStore.addChangeListener(this.getStockTrades);
  },

  componentWillUnmount: function () {
    StockTradesStore.removeChangeListener(this.getStockTrades);
  },

  createStockPerformanceElements: function () {
    console.log(this.state.stockTrades);
    if (typeof this.state.stockTrades.stockPerformances !== 'undefined') {
      return this.state.stockTrades.stockPerformances.map(this.createStockPerformanceElement);
    }

    return null;
  },

  createStockPerformanceElement: function (stockPerformance) {
    return <StockPerformance stockPerformance={stockPerformance} key={stockPerformance.id} />;
  },

  render: function () {
    return (
      <div className="container analysis">

        <div className="overall-performance">
          <div className="row">
            <div className="col-sm-12">

              <OverallStockPerformance 
                overallPerformance={this.state.stockTrades.overallPerformance} 
                totalCommissions={this.state.stockTrades.totalCommissions} />

            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
              {this.createStockPerformanceElements()}
          </div>
        </div>

        <AnalyticsFooter />

      </div>
    );
  }
});

module.exports = Analysis;