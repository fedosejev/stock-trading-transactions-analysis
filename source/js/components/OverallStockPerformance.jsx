var React = require('react');
var ConfigStore = require('../stores/ConfigStore');

var OverallStockPerformance = React.createClass({

  getStockResultClassName: function (stockResult) {
    if (stockResult > 0) {
      return 'profit';
    } else if (stockResult < 0) {
      return 'loss';
    } else {
      return 'no-sell';
    }
  },

  render: function () {
    var overallPerformance = this.props.overallPerformance;
    var totalCommissions = this.props.totalCommissions;
    var overallPerformance = overallPerformance.toFixed(2);
    var currencySign = ConfigStore.getCurrency();

    return (
      <div className="overall-performance-data">
        <h2>Overall Performance</h2>
        <div className={'result ' + this.getStockResultClassName(overallPerformance)}>
          <sup className="currency">{currencySign}</sup>
          {parseFloat(overallPerformance).toLocaleString()}
        </div>
        <div className="commissions">
          <h6>Commissions</h6>
          <p>{currencySign + totalCommissions}</p>
        </div>
      </div>
    );
  }
});

module.exports = OverallStockPerformance;