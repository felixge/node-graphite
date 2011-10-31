var net     = require('net');
var url     = require('url');

module.exports = CarbonClient;
function CarbonClient(socket) {
  this.socket = socket;
  this.host   = null;
  this.port   = null;
}
CarbonClient.DEFAULT_HOST = 'localhost';
CarbonClient.DEFAULT_PORT = 2003;

CarbonClient.parse = function(dsn) {
  var parsed = url.parse(dsn);
  if (parsed.protocol !== 'plaintext:') {
    throw new Error('CarbonClient.UnknownProtocol: ' + parsed.protocol);
  }

  return {
    host       : parsed.hostname || CarbonClient.DEFAULT_HOST,
    port       : parsed.port || CarbonClient.DEFAULT_PORT,
    namespace  : (parsed.pathname)
      ? parsed.pathname.substr(1)
      : '',
  };

};

CarbonClient.createClient = function(dsn) {
  var parsed  = this.parse(dsn);
  var socket  = net.createConnection(parsed.port, parsed.host);

  var client  = new this(socket);
  client.host = parsed.host;
  client.port = parsed.port;

  return client;
};

CarbonClient.prototype.write = function(path, value, timestamp, cb) {
  if (arguments.length === 3) {
    cb = timestamp;
    timestamp = Date.now();
  }

  timestamp = timestamp / 1000;

  var line = [path, value, timestamp].join(' ');
  this.socket.write(line + '\n', 'utf8', cb);
};

CarbonClient.prototype.getJSON = function() {
  var url = 'http://' + this.host + '/';
};

CarbonClient.prototype.end = function() {
  this.socket.end();
};
