var React = require('react');
var FileDragAndDrop = require('react-file-drag-and-drop');
var FileActionCreators = require('../actions/FileActionCreators');
var StockTradesStore = require('../stores/StockTradesStore');
var StockPerformance = require('../components/StockPerformance.jsx');
var Landing = require('../components/Landing.jsx');
var Analysis = require('../components/Analysis.jsx');

var Application = React.createClass({
  
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

  handleDrop: function (dataTransfer) {
    var files = dataTransfer.files;
    FileActionCreators.readFirstFile(files);
  },

  render: function () {

    if (typeof this.state.stockTrades.stockPerformances === 'undefined') {
      return (
        <FileDragAndDrop onDrop={this.handleDrop}>
          <Landing />
        </FileDragAndDrop>
      );
    }

    return (
      <FileDragAndDrop onDrop={this.handleDrop}>
        <Analysis />
      </FileDragAndDrop>
    );

  }
});

module.exports = Application;