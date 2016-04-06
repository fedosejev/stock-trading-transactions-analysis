var $ = require('jquery');
var csvParser = require('./csv-parser');
var engine = require('./engine');

var FILE_NAME = '';
var COMMISSION = 5.95;

global.CURRENCY_SIGN = '£';

$('[name="currency"]').on('change', function () {
  var currencySign = $(this).val();
  global.CURRENCY_SIGN = currencySign;
});

function handleFileContent(fileOnLoadEvent) {
  var csv = fileOnLoadEvent.target.result;
  var json;
  var stocks;
  var sellOutcomes;

  csv = csvParser.fixCsvStringProducedByXO(csv);
  json = csvParser.convertCsvToJson(csv);
  stocks = csvParser.groupTradesByStock(json);

  console.log('Your stocks and transactions:');
  console.log(stocks);

  stocks = csvParser.cleanStocksTransactions(stocks);

  sellOutcomes = engine.calculateProfitsOrLossesForEachStock(stocks);

  sellOutcomes.forEach(function (result) {
    renderStock(result);
  });

  console.log('!!! sellOutcomes: ' + sellOutcomes);
}

function renderStock(stock) {
  var stockName = stock.symbol.split('.')[0];
  var stockResult = stock.overallResult;

  var $stockContainer = $('<div class="stock"></div>');
  var $stockName = $('<div class="stock-name">' + stockName + '</div>');
  var $stockResult;
  
  if (stockResult > 0) {
    $stockResult = $('<div class="stock-result profit"><sup class="currency">' + CURRENCY_SIGN + '</sup>' + parseFloat(stockResult).toLocaleString() + '</div>');
  } else if (stockResult < 0) {
    $stockResult = $('<div class="stock-result loss"><sup class="currency">' +  CURRENCY_SIGN + '</sup>' + parseFloat(stockResult).toLocaleString() + '</div>');
  } else {
    $stockResult = $('<div class="stock-result no-sell"><sup class="currency">' + CURRENCY_SIGN + '</sup>' + parseFloat(stockResult).toLocaleString() + '</div>');
  }

  $stockContainer.append($stockName);
  $stockContainer.append($stockResult);

  $('[data-app]').append($stockContainer);
}

function handleFileSelect(dropEvent) {
  dropEvent.stopPropagation();
  dropEvent.preventDefault();

  $('[data-app]').html('');
  $('body').removeClass('landing');

  var files = dropEvent.dataTransfer.files; // FileList object.
  var firstFile = files[0];

  FILE_NAME = firstFile.name.replace('.csv', '');

  var fileReader = new FileReader();
  fileReader.onload = handleFileContent;
  fileReader.readAsText(firstFile);
}

function handleDragOver(dragOverEvent) {
  dragOverEvent.stopPropagation();
  dragOverEvent.preventDefault();
  dragOverEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function showLandingView() {
  document.querySelector('[data-landing]').classList.remove('hide');
}

function showLoadingView() {
  document.querySelector('[data-loading]').classList.remove('hide');
}

function hideLoadingView() {
  document.querySelector('[data-loading]').classList.add('hide');
}

document.addEventListener('DOMContentLoaded', function handleDOMContentLoaded() {
  var dropZoneElement = document.querySelector('html');
  dropZoneElement.addEventListener('dragover', handleDragOver, false);
  dropZoneElement.addEventListener('drop', handleFileSelect, false);
});