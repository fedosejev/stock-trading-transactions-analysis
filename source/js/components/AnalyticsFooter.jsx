var React = require('react');

var AnalyticsFooter = React.createClass({
  render: function () {
    return (
      <footer>
        <p>
          <strong>Disclaimer:</strong> None of the content published on this website constitutes a recommendation that any particular security, portfolio of securities, transaction or investment strategy is suitable for any specific person. None of the information providers or their affiliates will advise you personally concerning the nature, potential, value or suitability of any particular security, portfolio of securities, transaction, investment strategy or other matter.
        </p>

        Created by <a href="http://artemij.com">Artemij Fedosejev</a> in 2016.

      </footer>
    );
  }
});

module.exports = AnalyticsFooter;