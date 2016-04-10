var React = require('react');
var ConfigStore = require('../stores/ConfigStore');
var ConfigActionCreators = require('../actions/ConfigActionCreators');
var FileActionCreators = require('../actions/FileActionCreators');

var SAMPLE_JSON_DATA = require('../../../sample.json');

var Landing = React.createClass({
  getInitialState: function () {
    return {
      currency: ConfigStore.getCurrency(),
      commissions: ConfigStore.getCommissions()
    };
  },

  handleCurrencyChange: function (event) {
    ConfigActionCreators.setCurrency(event.target.value);
  },

  handleCommissionsChange: function (event) {
    ConfigActionCreators.setCommissions(event.target.value);
  },

  handleSetNoCommissions: function () {
    ConfigActionCreators.setCommissions(0);
  },

  handleAnalyseSampleData: function () {
    FileActionCreators.analyseJsonData(SAMPLE_JSON_DATA);
  },

  componentDidMount: function () {
    ConfigStore.addChangeListener(this.setConfig);
  },

  componentWillUnmount: function () {
    ConfigStore.removeChangeListener(this.setConfig);
  },

  setConfig: function () {
    this.setState({
      currency: ConfigStore.getCurrency(),
      commissions: ConfigStore.getCommissions()
    });
  },

  render: function () {
    return (
      <div className="container landing">
        <div className="row">
          <div className="col-sm-12">

            <section className="landing">
              <div className="logo"><i className="fa fa-line-chart"></i></div>
               
              <h2>1. Choose your currency:</h2>

              <div className="radio-inline">
                <label>
                  <input type="radio" name="currency" id="optionsRadios1" value="£" checked={this.state.currency === '£' ? true : false} onChange={this.handleCurrencyChange} />
                  <span>£</span>
                </label>
              </div>
              <div className="radio-inline">
                <label>
                  <input type="radio" name="currency" id="optionsRadios2" value="$" checked={this.state.currency === '$' ? true : false} onChange={this.handleCurrencyChange} />
                  <span>$</span>
                </label>
              </div>
              <div className="radio-inline">
                <label>
                  <input type="radio" name="currency" id="optionsRadios3" value="€" checked={this.state.currency === '€' ? true : false} onChange={this.handleCurrencyChange} />
                  <span>€</span>
                </label>
              </div>
              <div className="radio-inline">
                <label>
                  <input type="radio" name="currency" id="optionsRadios3" value="¥" checked={this.state.currency === '¥' ? true : false} onChange={this.handleCurrencyChange} />
                  <span>¥</span>
                </label>
              </div>
              <div className="radio-inline">
                <label>
                  <input type="radio" name="currency" id="optionsRadios3" value="₽" checked={this.state.currency === '₽' ? true : false} onChange={this.handleCurrencyChange} />
                  <span>₽</span>
                </label>
              </div>

              <h2>2. Set commission paid per trade:</h2>

              <form className="form-inline">
                <div className="form-group">
                  <input type="number" className="form-control input-lg" placeholder="" value={this.state.commissions} onChange={this.handleCommissionsChange} />
                  <button type="button" className="btn btn-danger btn-lg no-commissions-button" onClick={this.handleSetNoCommissions}>No commissions</button>
                </div>
              </form>

              <h2>3. <a href="https://docs.google.com/spreadsheets/d/18kStFA1T0U4DP6kAKOvRsQ_wp_3eDlDYhMtfiZtApEg/edit?usp=sharing" target="_blank">Copy our sample spreadsheet</a> and fill in your stock trades*.</h2>

              <h2>4. Download as CSV, and then drag and drop your CSV file here*.</h2>

              <h2>Or see example of analysis for our sample data:</h2>

              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Stock code</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Net value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>01/11/2015</td>
                      <td>TSLA</td>
                      <td>Bought</td>
                      <td>7</td>
                      <td>982.22</td>
                    </tr>
                    <tr>
                      <td>01/12/2015</td>
                      <td>TSLA</td>
                      <td>Sold</td>
                      <td>7</td>
                      <td>1289.25</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button className="btn btn-danger btn-lg" onClick={this.handleAnalyseSampleData}>Analyse data</button>

              <h3>This app calculates your profits and/or losses from stock trading. We do not save your data.</h3>

              <p>* For <a href="http://x-o.co.uk">X-O.co.uk</a> users: download your transactions CSV file, then drag and drop it here.</p>

              <footer>Created by <a href="http://artemij.com">Artemij Fedosejev</a> in 2016.</footer>
            </section>

          </div>
        </div>
      </div>
    );

  }
});

module.exports = Landing;