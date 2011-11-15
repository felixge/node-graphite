var common       = require('../common');
var test         = require('utest');
var assert       = require('assert');
var sinon        = require('sinon');
var CarbonClient = require(common.dir.lib + '/carbon_client');

var client;
var fakeSocket;
test('write', {
  before: function() {
    fakeSocket = {write: sinon.stub()};
    client = new CarbonClient({socket: fakeSocket});
  },

  'with single payload': function() {
    client.write('foo.bar', 25);

    var write = fakeSocket.write.args.shift();
    assert.ok(/^foo\.bar 25 [\d]+\n/.test(write[0]));
    assert.equal(write[1], 'utf8');
    assert.equal(write[2], undefined);
  },

  'with single payload and callback': function() {
    var cb     = function() {};
    client.write('foo.bar', 25, cb);

    var write = fakeSocket.write.args.shift();
    assert.ok(/^foo\.bar 25 [\d]+\n/.test(write[0]));
    assert.equal(write[2], cb);
  },

  'with single payload and timestamp': function() {
    var cb     = function() {};
    client.write('foo.bar', 25, 2001, cb);

    var write = fakeSocket.write.args.shift();
    assert.ok(/^foo\.bar 25 2\n/.test(write[0]));
    assert.equal(write[2], cb);
  },

  'with multiple payloads and callback': function() {
    var cb     = function() {};
    client.write([
      {path: 'one', value: 30, timestamp: 9000},
      {path: 'two', value: 33, timestamp: 8000},
    ], cb);

    var write = fakeSocket.write.args.shift();
    assert.ok(/^one 30 9\ntwo 33 8\n/.test(write[0]));
    assert.equal(write[2], cb);
  }
});
