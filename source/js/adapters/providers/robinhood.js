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

function getTransactionDate(alienDataObject) {
  if (typeof alienDataObject.created_at !== 'undefined') {
    return convertDate(alienDataObject.created_at);
  }

  if (typeof alienDataObject.date_executed !== 'undefined') {
    return convertDate(alienDataObject.date_executed);
  }

  throw 'Can\'t find transaction date field. Use `created_at` or `date_executed`.';
}

function getTransactionType(alienDataObject) {
  if (typeof alienDataObject.side !== 'undefined') {
    return convertType(alienDataObject.side);
  }

  if (typeof alienDataObject.transaction_type !== 'undefined') {
    return convertType(alienDataObject.transaction_type);
  }

  throw 'Can\'t find transaction type field. Use `side` or `transaction_type`.';
}

function getQuantity(alienDataObject) {
  if (typeof alienDataObject.quantity !== 'undefined') {
    return alienDataObject.quantity;
  }

  if (typeof alienDataObject.shares !== 'undefined') {
    return alienDataObject.shares;
  }

  throw 'Can\'t find quantity field. Use `quantity` or `shares`.';
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

    Date = created_at / date_executed
    Stock code = symbol
    Type = side / transaction_type
    Quantity = quantity / shares
    Net value = price * Quantity

  */
  
  var adaptedData = 
    alienData.map(function adaptDataObject(alienDataObject) {
      return {
        'Date': getTransactionDate(alienDataObject),
        'Stock code': alienDataObject.symbol,
        'Type': getTransactionType(alienDataObject),
        'Quantity': getQuantity(alienDataObject),
        'Net value': alienDataObject.price * getQuantity(alienDataObject)
      };
    });

  return adaptedData;
}

module.exports = {
  adapt: adapt
};