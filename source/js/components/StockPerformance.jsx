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
    var sharesHolding = stock.sharesHolding;
    var currencySign = ConfigStore.getCurrency();
    var payCommissions = (ConfigStore.getCommissions() > 0);

    return (
      <div className="stock">
        <div className="stock-name">
          <a href={'http://finance.yahoo.com/q?s=' + stockName} target="_blank">{stockName}</a>
        </div>
        <div className={'stock-result ' + this.getStockResultClassName(stockResult)}>
          <sup className="currency">{currencySign}</sup>
          {parseFloat(stockResult).toLocaleString()}
        </div>

        { payCommissions ? 
          <div className="commissions">
            <h6>Included commissions</h6>
            <p>{currencySign + stockCommissions}</p>
          </div>
        : null }

        <div className="shares-holding">
          <h6>Shares holding</h6>
          <p>{sharesHolding}</p>
        </div>
      </div>
    );
  }
});

module.exports = StockPerformance;