function readFirstCsvFile(files) {
  return new Promise(function (resolve, reject) {

    var firstFile = files[0];
    var fileReader = new FileReader();

    fileReader.onload = function handleFileContent(fileOnLoadEvent) {
      var csv = fileOnLoadEvent.target.result;
      resolve(csv);
    };

    fileReader.onerror = function handlFileReaderError(error) {
      reject(error);
    };

    fileReader.readAsText(firstFile);

  });
}

module.exports = {
  readFirstCsvFile: readFirstCsvFile
};

function handleFileContent(fileOnLoadEvent) {
  var csv = fileOnLoadEvent.target.result;
  var json;
  var stocks;
  var sellOutcomes;
  var overallPerformance;
  var totalCommissions;

  json = csvParser.convertCsvToJson(csv);
  stocks = csvParser.groupTradesByStock(json);

  console.log('Your stocks and transactions:');
  console.log(stocks);

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