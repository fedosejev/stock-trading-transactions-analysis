var React = require('react');
var RobinhoodLoginForm = require('./RobinhoodLoginForm.jsx');
var FileActionCreators = require('../actions/FileActionCreators');
var robinhoodApi = require('../robinhood-api');
var serverDataParser = require('../server-data-parser');

var Landing = React.createClass({
  
  getInitialState: function () {
    return {
      isFormSubmitted: false
    };
  },

  handleFormSubmit: function (username, password) {
    this.setState({
      isFormSubmitted: true
    });

    var config = {
      username: username,
      password: password
    };

    robinhoodApi.getOrders(config, function (error, orders) {
      if (error) {
        console.error(error);
        return;
      }

      var csv = serverDataParser.convertJsonToCsv(orders);

      FileActionCreators.parseCsvData(csv);
    });

  },

  render: function () {

    if (this.state.isFormSubmitted) {
      return (
        <div className="container landing">
          <div className="row">
            <div className="col-sm-12">
              <div className="getting-robinhood-data">

                <div className="row">
                  <div className="col-sm-6 col-sm-offset-3"> 
                    <img src="/images/getting-data.jpeg" />
                  </div>
                </div>

                <p>We're getting your Robinhood trading results, please wait...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container landing">
        <div className="row">
          <div className="col-sm-12">

            <section className="landing">

              <div className="logo">
                <webicon icon="color-icons:bullish"></webicon>
              </div>

              <h1>Using <a href="https://www.robinhood.com" target="_blank">Robinhood app</a>?<br/>Do you want to see your stock trading results?</h1>

              <div className="row">
                <div className="col-sm-6 col-sm-offset-3">
                  <RobinhoodLoginForm handleFormSubmit={this.handleFormSubmit} />
                </div>
              </div>

              <div className="or">
                Or
              </div>

              <h2 className="how-to-use">Drag and drop your CSV file exported from the Robinhood app here.</h2>

              <h3>StockTrading.report calculates profits/losses from your stock trading via <a href="http://robinhood.com" target="_blank">Robinhood app</a> and <a href="http://x-o.co.uk" target="_blank">X-O.co.uk</a>. We <strong>do not</strong> store your data.</h3>

              <footer>Created by <a href="http://artemij.com">Artemij Fedosejev</a> in 2016.</footer>
            </section>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Landing;