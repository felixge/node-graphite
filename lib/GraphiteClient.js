var CarbonClient = require('./CarbonClient');

module.exports = GraphiteClient;
function GraphiteClient(properties) {
  this._carbon = properties.carbon;
}

GraphiteClient.createClient = function(carbonDsn) {
  var client = new this({
    carbon: new CarbonClient({dsn: carbonDsn}),
  });
  return client;
};

GraphiteClient.flatten = function(obj, flat, prefix) {
  flat   = flat || {};
  prefix = prefix || '';

  for (var key in obj) {
    var value = obj[key];
    if (typeof value === 'object') {
      this.flatten(value, flat, prefix + key + '.');
    } else {
      flat[prefix + key] = value;
    }
  }

  return flat;
};

/**
 * Writes the given metrics to the underlying plaintext socket to Graphite
 *
 * If no timestamp is given, the current Unix epoch is used (second precision).
 *
 * If a timestamp is provided, it must have a millisecond precision, otherwise
 * Graphite will probably reject the data.
 *
 * @param {object} metrics
 * @param {object} timestamp
 * @param {function} cb
 */
GraphiteClient.prototype.write = function(metrics, timestamp, cb) {
  if (typeof timestamp === 'function') {
    cb = timestamp;
    timestamp = undefined;
  }

  // cutting timestamp for precision up to the second
  timestamp = Math.floor(Date.now() / 1000);

  this._carbon.write(GraphiteClient.flatten(metrics), timestamp, cb);
};

GraphiteClient.prototype.end = function() {
  this._carbon.end();
};
