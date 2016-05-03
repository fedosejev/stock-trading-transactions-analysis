var React = require('react');

var Disclaimer = React.createClass({
  render: function () {
    return (
      <section className="disclaimer container">
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <strong>Disclaimer:</strong> None of the content published on this website constitutes a recommendation that any particular security, portfolio of securities, transaction or investment strategy is suitable for any specific person. None of the information providers or their affiliates will advise you personally concerning the nature, potential, value or suitability of any particular security, portfolio of securities, transaction, investment strategy or other matter.
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Disclaimer;