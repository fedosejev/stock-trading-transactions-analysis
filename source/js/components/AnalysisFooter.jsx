var React = require('react');
var Disclaimer = require('./Disclaimer.jsx');

var AnalysisFooter = React.createClass({
  render: function () {
    return (
      <footer>
        <Disclaimer />
        
        Created by <a href="http://artemij.com">Artemij Fedosejev</a> in 2016.

      </footer>
    );
  }
});

module.exports = AnalysisFooter;