var providerRobinhood = require('./providers/robinhood');
var providerXO = require('./providers/x-o');
var providers = require('./providers.json');
var ConfigActionCreators = require('../actions/ConfigActionCreators');

function convertDataObjectKeysToKey(dataObjectKeys) {
  return dataObjectKeys.sort().join('|');
}

function detectProvider(dataObjectKeys) {
  var providerKey = convertDataObjectKeysToKey(dataObjectKeys);

  return providers.patterns[providerKey];
}

function adapt(data) {
  var dataObjectKeys = Object.keys(data[0]);
  var providerName = detectProvider(dataObjectKeys);
  var providers = {
    'robinhood': providerRobinhood,
    'x-o': providerXO
  };
  var provider = providers[providerName];

  ConfigActionCreators.setCurrency(getCurrency(providerName));
  ConfigActionCreators.setCommissions(getCommissions(providerName));

  return provider.adapt(data);
}

function getListOfDataKeys(serviceName) {
  return providers.services[serviceName].dataKeyNames;
}

function getCurrency(serviceName) {
  return providers.services[serviceName].currency;
}

function getCommissions(serviceName) {
  return providers.services[serviceName].commissions;
}

module.exports = {
  adapt: adapt
};