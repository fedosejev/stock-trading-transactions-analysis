var React = require('react');
var StockTradesStore = require('../stores/StockTradesStore');
var StockPerformance = require('../components/StockPerformance.jsx');
var OverallStockPerformance = require('../components/OverallStockPerformance.jsx');
var OverallStockPerformanceGraph = require('../components/OverallStockPerformanceGraph.jsx');
var AnalysisFooter = require('./AnalysisFooter.jsx');

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

        {StockTradesStore.getIsCorruptedCsvData() ? <div className="corrupted-csv-data">Looks like your CSV data is corrupted - please check your CSV file.</div> : null}

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

        <AnalysisFooter />

      </div>
    );
  }
});

module.exports = Analysis;