var React = require('react');
var ConfigStore = require('../stores/ConfigStore');

var TotalAmountBoughtFor = function (props) {
  var totalAmounts = props.totalAmountBoughtFor;
  var totalCommissions = totalAmounts.totalCommissionsPaidForBuyingStocks.toFixed(2);
  var totalAmountBoughtFor = totalAmounts.totalAmountBoughtFor.toFixed(2);
  var currencySign = ConfigStore.getCurrency();

  return (
    <div className="overall-performance-data">
      <h2>Total Amout Bought For</h2>
      <div className="result">
        <sup className="currency">{currencySign}</sup>
        {parseFloat(totalAmountBoughtFor).toLocaleString()}
      </div>
      <div className="commissions">
        <h6>Commissions</h6>
        <p>{currencySign + totalCommissions}</p>
      </div>
    </div>
  );
};

module.exports = TotalAmountBoughtFor;