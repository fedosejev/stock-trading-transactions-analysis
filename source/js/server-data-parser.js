function convertObjectToCsv(object) {
  return Object.keys(object)
    .filter(function (key) {
      return key !== 'executions';
    })
    .map(function (key) {
      return object[key];
    })
    .join(',');
}

function convertObjectsToCsv(objects) {
  return objects.map(convertObjectToCsv).join('\n');
}

function convertJsonToCsv(data) {
  var csv = Object.keys(data[0])
                  .filter(function (object) {
                    return object !== 'executions';
                  })
                  .join(',');

  csv = csv + '\n' + convertObjectsToCsv(data);

  return csv;
}

module.exports = {
  convertJsonToCsv: convertJsonToCsv
};