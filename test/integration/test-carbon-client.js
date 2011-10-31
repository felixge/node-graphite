var common       = require('../common');
var graphite     = common.graphite;
var assert       = require('assert');
var carbonClient = graphite.createCarbonClient(common.config.carbon);
var key          = 'test.write';
var value        = 42;

carbonClient.write(key, value, function(err) {
  if (err) throw err;

  var graphiteClient = graphite.createGraphiteClient(common.config.graphite);
  var options        = {
    target       : key,
    from         : '-1minute',

    // Undocumented magic we hoped would help us with a better assert, but
    // has not so far.
    noCache      : 'True',
    cacheTimeout : 0,
  };

  graphiteClient.getJSON(options, function(err, json) {
    if (err) throw err;

    // Terrible check, but we had trouble getting the latest info
    assert.ok(json[0].datapoints.length > 0);
    carbonClient.end();
  });
});
