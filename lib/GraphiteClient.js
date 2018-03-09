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

GraphiteClient.appendTags = function(flatMetrics, tags) {
  tagSuffix = '';
  res = {};

  flatTags = GraphiteClient.flatten(tags);
  for (var key in flatTags) {
    tagSuffix += ';' + key + '=' + flatTags[key];
  }

  for (var key in flatMetrics) {
    res[key + tagSuffix] = flatMetrics[key];
  }

  return res;
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
    timestamp = null;
  }

  // default timestamp to now
  timestamp = timestamp || Date.now();

  // cutting timestamp for precision up to the second
  timestamp = Math.floor(timestamp / 1000);

  this._carbon.write(GraphiteClient.flatten(metrics), timestamp, cb);
};

GraphiteClient.prototype.writeTagged = function(metrics, tags, timestamp, cb) {
  taggedMetrics = GraphiteClient.appendTags(GraphiteClient.flatten(metrics), tags);
  this.write(taggedMetrics, timestamp, cb);
}

GraphiteClient.prototype.end = function() {
  this._carbon.end();
};
