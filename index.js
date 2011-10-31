var CarbonClient   = require('./lib/carbon_client');
var GraphiteClient = require('./lib/graphite_client');

exports.createCarbonClient = function() {
  return CarbonClient.createClient.apply(CarbonClient, arguments);
};

exports.createGraphiteClient = function() {
  return GraphiteClient.createClient.apply(GraphiteClient, arguments);
};
