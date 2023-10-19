var net = require('net');
const dgram = require('node:dgram');

module.exports = LazySocket;
function LazySocket(properties) {
  properties = properties || {};

  this.port = properties.port;
  this.host = properties.host;
  this.protocol = properties.protocol;

  this._socket    = null;
  this._closed = false;
  this._callbacks = [];
}

LazySocket.createConnection = function(port, host, protocol) {
  var socket = new this({port: port, host: host, protocol: protocol});
  return socket;
};

LazySocket.prototype.write = function(/* data, encoding, cb */) {
  var self = this;
  var args = Array.prototype.slice.call(arguments);
  var cb   = args[args.length - 1];

  if (typeof cb === 'function') {
    var cbProxy = function() {
      var index = self._callbacks.indexOf(cbProxy);
      self._callbacks.splice(index, 1);

      return cb.apply(this, arguments);
    };

    args[args.length - 1] = cbProxy;
    this._callbacks.push(cbProxy);
  }

  this._lazyConnect();

  try {
    if (this.protocol === 'udp') {
      this._socket.send(args[0], this.port, this.host, cbProxy);
    } else {
      this._socket.write.apply(this._socket, args);
    }
  } catch (err) {
    if (cbProxy) cbProxy(err);

    this.destroy();
    this._socket = null;
  }
};

LazySocket.prototype._lazyConnect = function() {
  if (this._socket) return;

  var self = this;

  function onerror(err) {
    self._socket = null;
    self._callbacks.forEach(function(cb) {
      cb(err);
    });
  }

  function onend() {
    // "end" is called when the socket connection is terminated, regardless of the termination being unexpected or not
    // to distinguish between unexpected terminations (e.g need reconnection)
    // from expected terminations (e.g calling LazySocket's .end() or .destroy()), the later are flagged as "closed"

    if (!self._closed) {
      self._socket = null;
    }
  }

  if (this.protocol === 'udp') {
    this._socket = dgram.createSocket({type: 'udp4'})
      .once('error', onerror)
      .once('close', onend);
  } else {
    this._socket = net
    .createConnection(this.port, this.host)
    .once('error', onerror)
    .once('end', onend);
  }
};

LazySocket.prototype.end = function() {
  this._closed = true;
  if (!this._socket) return;

  if (this.protocol === 'udp') {
    this._socket.unref();
  } else {
    this._socket.end();
  }
};

LazySocket.prototype.destroy = function() {
  this._closed = true;
  if (!this._socket) return;

  if (this.protocol === 'udp') {
    this._socket.unref();
  } else {
    this._socket.destroy();
  }
};
