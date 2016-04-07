var $ = require('jquery');
var csvParser = require('./csv-parser');
var engine = require('./engine');

var FILE_NAME = '';
global.COMMISSION = 0;
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
  var overallPerformance;
  var totalCommissions;

  //csv = csvParser.fixCsvStringProducedByXO(csv);
  json = csvParser.convertCsvToJson(csv);
  stocks = csvParser.groupTradesByStock(json);

  console.log('Your stocks and transactions:');
  console.log(stocks);

  //stocks = csvParser.cleanStocksTransactions(stocks);

  sellOutcomes = engine.calculateProfitsOrLossesForEachStock(stocks);

  sellOutcomes.forEach(renderStock);

  overallPerformance = sellOutcomes.reduce(function sumOutcomes(accumulator, currentValue) {
    return parseFloat(accumulator) + parseFloat(currentValue.overallResult);
  }, 0);

  totalCommissions = sellOutcomes.reduce(function sumOutcomes(accumulator, currentValue) {
    return parseFloat(accumulator) + parseFloat(currentValue.commissions);
  }, 0);

  renderOverallPerformance(overallPerformance, totalCommissions);
}

function renderOverallPerformance(overallPerformance, totalCommissions) {
  var $result;

  var $container = $('<div class="overall-performance"></div>');
  var $header = $('<h2>Overall Performance</h2>');
  var $result;
  var $commissions = $('<div class="commissions"><h6>Commissions</h6><p>' + CURRENCY_SIGN + totalCommissions.toFixed(2) + '</p></div>');

  if (overallPerformance > 0) {
    $result = $('<div class="result profit"><sup class="currency">' + CURRENCY_SIGN + '</sup>' + parseFloat(overallPerformance).toLocaleString() + '</div>');
  } else if (overallPerformance < 0) {
    $result = $('<div class="result loss"><sup class="currency">' +  CURRENCY_SIGN + '</sup>' + parseFloat(overallPerformance).toLocaleString() + '</div>');
  } else {
    $result = $('<div class="result no-sell"><sup class="currency">' + CURRENCY_SIGN + '</sup>' + parseFloat(overallPerformance).toLocaleString() + '</div>');
  }

  $container.append($header);
  $container.append($result);
  $container.append($commissions);

  $('[data-js-overall-performance]').append($container);
}

function renderStock(stock) {
  var stockName = stock.symbol.split('.')[0];
  var stockResult = stock.overallResult.toFixed(2);

  var $stockContainer = $('<div class="stock"></div>');
  var $stockName = $('<div class="stock-name">' + stockName + '</div>');
  var $stockResult;
  var $commissions = $('<div class="commissions"><h6>Commissions</h6><p>' + CURRENCY_SIGN + stock.commissions + '</p></div>');
  
  if (stockResult > 0) {
    $stockResult = $('<div class="stock-result profit"><sup class="currency">' + CURRENCY_SIGN + '</sup>' + parseFloat(stockResult).toLocaleString() + '</div>');
  } else if (stockResult < 0) {
    $stockResult = $('<div class="stock-result loss"><sup class="currency">' +  CURRENCY_SIGN + '</sup>' + parseFloat(stockResult).toLocaleString() + '</div>');
  } else {
    $stockResult = $('<div class="stock-result no-sell"><sup class="currency">' + CURRENCY_SIGN + '</sup>' + parseFloat(stockResult).toLocaleString() + '</div>');
  }

  $stockContainer.append($stockName);
  $stockContainer.append($stockResult);
  $stockContainer.append($commissions);

  $('[data-js-section-analysis]').append($stockContainer);
}

function handleFileSelect(dropEvent) {
  dropEvent.stopPropagation();
  dropEvent.preventDefault();

  COMMISSION = parseFloat($('[data-js-commission-paid-per-trade]').val());

  $('[data-js-section-landing]').hide();
  $('[data-js-section-analysis]').show();

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