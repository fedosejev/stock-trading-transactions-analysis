var moment = require('moment');

function convertType(alienType) {
  var map = {
    'buy': 'Bought',
    'sell': 'Sold'
  };

  return map[alienType];
}

function convertDate(alienDate) {
  return moment(alienDate, moment.ISO_8601).format('DD/MM/YYYY');
}

function adapt(alienData) {

  /*

    Field name = X-O data | Robinhood data

    Date = 03/11/2015 | 2016-04-06T15:29:21.791878Z
    Stock code = TSLA.O | TSLA 
    Type = (Bought / Sold) | (buy / sell)
    Quantity = 7 | 11
    Net value = 982.22 | 2 * 245.4401

    Mapping X-O to Robinhood:

    Date = created_at
    Stock code = symbol
    Type = side
    Quantity = quantity
    Net value = price * quantity

  */
  
  var adaptedData = 
    alienData
    .filter(function filterCumulativeQuantityGreaterThanZero(alienDataObject) {
      return alienDataObject.cumulative_quantity > 0;
    })
    .map(function adaptDataObject(alienDataObject) {
      return {
        'Date': convertDate(alienDataObject.created_at),
        'Stock code': alienDataObject.symbol,
        'Type': convertType(alienDataObject.side),
        'Quantity': alienDataObject.quantity,
        'Net value': alienDataObject.price * alienDataObject.quantity
      };
    });

  return adaptedData;
}

module.exports = {
  adapt: adapt
};