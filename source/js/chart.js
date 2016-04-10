var Chartist = require('chartist');

function renderLineChart(stocksTrades, currency) {
  var data = {
    labels: stockSymbols,
    series: [ stockPerformancesNumbers ]
  };

  var options = {
    seriesBarDistance: 10,
    reverseData: true,
    horizontalBars: true,
    axisY: {},
    axisX: {
      labelInterpolationFnc: function(value) {

        var label = '';
        var remainder = 0;

        if (Math.abs(value) >= 1000) {
          label = label + (value / 1000).toFixed();

          remainder = value % 1000;

          if (remainder > 0) {
            label = label + remainder;
          }

          label = label + 'K';

        } else  {

          label = value;

        }

        return currency + label;
      },
      labelOffset: {
        x: -10
      },
      position: 'start'
    }
  };

  new Chartist.Bar('[data-js-overall-performance-graph]', data, options);
}

function renderBarChart(stockSymbols, stockPerformancesNumbers, currency) {
  var data = {
    labels: stockSymbols,
    series: [ stockPerformancesNumbers ]
  };

  var options = {
    seriesBarDistance: 10,
    reverseData: true,
    horizontalBars: true,
    axisY: {},
    axisX: {
      labelInterpolationFnc: function(value) {

        var label = '';
        var remainder = 0;

        if (Math.abs(value) >= 1000) {
          label = label + (value / 1000).toFixed();

          remainder = value % 1000;

          if (remainder > 0) {
            label = label + remainder;
          }

          label = label + 'K';

        } else  {

          label = value;

        }

        return currency + label;
      },
      labelOffset: {
        x: -10
      },
      position: 'start'
    }
  };

  new Chartist.Bar('[data-js-overall-performance-graph]', data, options);
}

module.exports = {
  renderBarChart: renderBarChart,
  renderLineChart: renderLineChart
};