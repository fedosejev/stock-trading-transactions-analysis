var Chartist = require('chartist');
var Dygraph = require('../../node_modules/dygraphs/dygraph-combined');
var C3 = require('c3');

// Looking for the best chart solution.

function renderBarChart(stockSymbols, stockPerformancesNumbers, currency) {
  var data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
          {
              label: "My First dataset",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "rgba(220,220,220,0.75)",
              highlightStroke: "rgba(220,220,220,1)",
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: "My Second dataset",
              fillColor: "rgba(151,187,205,0.5)",
              strokeColor: "rgba(151,187,205,0.8)",
              highlightFill: "rgba(151,187,205,0.75)",
              highlightStroke: "rgba(151,187,205,1)",
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
  };

  // Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var myNewChart = new Chart(ctx).PolarArea(data);
}

function ____renderBarChart(stockSymbols, stockPerformancesNumbers, currency) {
  var chart = C3.generate({
      bindto: '[data-js-overall-performance-graph]',
      data: {
          columns: [
              ['data1', 30, 200, 100, 400, 150, 250],
              ['data2', 130, 100, 140, 200, 150, 50]
          ],
          type: 'bar'
      },
      bar: {
          width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
          }
          // or
          //width: 100 // this makes bar width 100px
      }
  });
}

function __renderBarChart(stockSymbols, stockPerformancesNumbers, currency) {
  var data = {
    labels: stockSymbols,
    series: [ stockPerformancesNumbers ]
  };

  console.log(stockSymbols.length);
  console.log(stockPerformancesNumbers);

  new Dygraph(document.querySelector('[data-js-overall-performance-graph]'), [stockPerformancesNumbers], {
    // legend: 'always',
    // title: 'NYC vs. SF',
    // showRoller: true,
    // rollPeriod: 14,
    // customBars: true,
    //ylabel: 'Temperature (F)',
    labels: stockSymbols
  });
}

function _renderBarChart(stockSymbols, stockPerformancesNumbers, currency) {
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
  renderBarChart: renderBarChart
};