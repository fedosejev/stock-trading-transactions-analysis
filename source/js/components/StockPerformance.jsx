var React = require('react');
var ConfigStore = require('../stores/ConfigStore');

var StockPerformance = React.createClass({

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
    var stock = this.props.stockPerformance;
    var stockName = stock.symbol.split('.')[0];
    var stockResult = stock.overallResult.toFixed(2);
    var stockCommissions = stock.commissions.toFixed(2);
    var currencySign = ConfigStore.getCurrency();

    return (
      <div className="stock">
        <div className="stock-name">
          <a href={'http://finance.yahoo.com/q?s=' + stockName} target="_blank">{stockName}</a>
        </div>
        <div className={'stock-result ' + this.getStockResultClassName(stockResult)}>
          <sup className="currency">{currencySign}</sup>
          {parseFloat(stockResult).toLocaleString()}
        </div>
        <div className="commissions"><h6>Commissions</h6><p>{currencySign + stockCommissions}</p></div>
      </div>
    );
  }
});

module.exports = StockPerformance;