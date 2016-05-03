var React = require('react');

var RobinhoodLoginForm = React.createClass({

  handleSubmitEvent: function (event) {
    event.preventDefault();

    var username = this.refs.username.value.trim();
    var password = this.refs.password.value;

    this.props.handleFormSubmit(username, password);
  },

  render: function () {
    return (
      <form onSubmit={this.handleSubmitEvent} className="robinhood-login-form">
        
        <div className="icon">
          <img src="/icons/key.svg" />
        </div>

        <h3>Login with your Robinhood app</h3>

        <div className="form-group">
          <label htmlFor="usernameInput">Username:</label>
          <input type="text" className="form-control input-lg" id="usernameInput" placeholder="" required ref="username" />
        </div>

        <div className="form-group">
          <label htmlFor="passwordInput">Password:</label>
          <input type="password" className="form-control input-lg" id="passwordInput" required ref="password" />
        </div>

        <p className="not-saving-login-message">
          <img src="/icons/about.svg" className="icon" />

          We <strong>do not</strong> store your username and/or password. We ask for it because <em>at the moment</em> that's <strong>the only way</strong> to get access to your Robinhood data. In addition, StockTrading.Report is an open source project - you're welcome to inspect <a href="https://github.com/fedosejev/stock-trading-transactions-analysis" target="_blank">the source code</a>.
        </p>

        <div className="submit-button-container">
          <button type="submit" className="btn btn-success btn-lg">Show my stock trading results</button>
        </div>
      </form>
    );
  }
});

module.exports = RobinhoodLoginForm;