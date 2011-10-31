var common       = require('../common');
var graphite     = common.graphite;
var assert       = require('assert');
var event        = {
  what : 'test.event',
  tags : 'foo, bar',
  data : 'some data',
  when : Date.now() / 1000,
}

var graphiteClient = graphite.createGraphiteClient(common.config.graphite);
graphiteClient.event(event, function(err) {
  if (err) throw err;
});
