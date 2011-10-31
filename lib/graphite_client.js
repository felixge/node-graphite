var querystring = require('querystring');
var request = require('request');

module.exports = GraphiteClient;
function GraphiteClient(endpoint) {
  this.endpoint = endpoint;
}

GraphiteClient.createClient = function(endpoint) {
  var client = new this(endpoint);
  return client;
};

GraphiteClient.prototype.getJSON = function(query, cb) {
  query = JSON.parse(JSON.stringify(query));
  query.format = 'json';

  var options = {
    path    : '/render',
    query   : query,
  };

  this._request(options, function(err, response, body) {
    if (err) return cb(err);

    try{
      var json = JSON.parse(body);
    } catch (err) {
      cb(new Error('GraphiteClient.InvalidJson: ' + err + ': ' + body));
      return;
    }

    cb(null, json);
  });
};

GraphiteClient.prototype.event = function(event, cb) {
  var options = {
    method : 'POST',
    path   : '/events/',
    json   : event,
  };

  this._request(options, function(err, response) {
    console.error(err);
    console.error(response.body);
    console.error(response.statusCode);
  });
};

GraphiteClient.prototype._request = function(options, cb) {
  var path = options.path || '/';
  if (options.query) path += '?' + querystring.stringify(options.query);

  var requestOptions = {
    method  : options.method || 'GET',
    uri     : this.endpoint + path,
    timeout : 10 * 1000,
    json    : options.json
  };

  request(requestOptions, cb);
};
