var React = require('react');

var Landing = React.createClass({
  render: function () {
    return (
      <div className="container landing">
        <div className="row">
          <div className="col-sm-12">

            <section className="landing">

              <div className="logo">
                <webicon icon="color-icons:bullish"></webicon>
              </div>

              <h1>Using <a href="https://www.robinhood.com" target="_blank">Robinhood app</a>? Do you want to see your stock trading results?</h1>

              <h2 className="how-to-use">Drag and drop your CSV file exported from the Robinhood app here.</h2>

              <h3>This app calculates your profits and/or losses from your stock trading. We <strong>do not</strong> save your data.</h3>

              <footer>Created by <a href="http://artemij.com">Artemij Fedosejev</a> in 2016.</footer>
            </section>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Landing;