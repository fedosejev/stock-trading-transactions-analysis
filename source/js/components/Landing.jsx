var React = require('react');
var RobinhoodLoginForm = require('./RobinhoodLoginForm.jsx');
var FileActionCreators = require('../actions/FileActionCreators');
var robinhoodApi = require('../robinhood-api');
var serverDataParser = require('../server-data-parser');

var Landing = React.createClass({
  
  getInitialState: function () {
    return {
      isFormSubmitted: false,
      isNothingFound: false
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
        this.setState({
          isFormSubmitted: false,
          isNothingFound: true
        });
        return;
      }

      // orders = [{
      //     "updated_at": "2016-04-28T14:42:47.947192Z",
      //     "ref_id": null,
      //     "time_in_force": "gfd",
      //     "fees": "0.04",
      //     "cancel": null,
      //     "id": "f19de62c-b274-4fe6-ad75-9445030561bc",
      //     "cumulative_quantity": "8.00000",
      //     "stop_price": null,
      //     "reject_reason": null,
      //     "instrument": "https://api.robinhood.com/instruments/ebab2398-028d-4939-9f1d-13bf38f81c50/",
      //     "state": "filled",
      //     "trigger": "immediate",
      //     "type": "market",
      //     "last_transaction_at": "2016-04-28T14:42:47Z",
      //     "price": null,
      //     "executions": [
      //         {
      //             "timestamp": "2016-04-28T14:42:47Z",
      //             "price": "119.30010000",
      //             "settlement_date": "2016-05-03",
      //             "quantity": "8.00000"
      //         }
      //     ],
      //     "account": "https://api.robinhood.com/accounts/5QR12230/",
      //     "url": "https://api.robinhood.com/orders/f19de62c-b274-4fe6-ad75-9445030561bc/",
      //     "created_at": "2016-04-28T14:42:47.674771Z",
      //     "side": "buy",
      //     "position": "https://api.robinhood.com/accounts/5QR12230/positions/ebab2398-028d-4939-9f1d-13bf38f81c50/",
      //     "average_price": "119.30010000",
      //     "quantity": "8.00000",
      //     "symbol": "AAPL"
      // }];

      var csv = serverDataParser.convertJsonToCsv(orders);

      FileActionCreators.parseCsvData(csv);
    }.bind(this));
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

    if (this.state.isNothingFound) {
      return (
        <div className="container landing">
          <div className="row">
            <div className="col-sm-12">
              <div className="getting-robinhood-data">

                <div className="row">
                  <div className="col-sm-6 col-sm-offset-3"> 
                    <img src="/images/no-data-found.jpg" />
                  </div>
                </div>

                <p>This is Searchy. He didn't find any of your Robinhood data.</p>
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