# graphite

[![Build Status](https://secure.travis-ci.org/felixge/node-graphite.png)](http://travis-ci.org/felixge/node-graphite)

A node.js client for graphite.

## Install

```
npm install graphite
```

## Usage

You first have to define the Graphite client:

```js
var graphite = require('graphite');
var client = graphite.createClient('plaintext://graphite.example.org:2003/');
```

You can send metrics without a timestamp. The current Unix epoch will then be used in place:

```js
var metrics = {foo: 23};
client.write(metrics, function(err) {
  // if err is null, your data was sent to graphite!
});
```

If you wish to set your own timestamp, you must use `Date.now()` (millisecond precision) as parameter and not `Math.floor(Date.now() / 1000)` (second precision), otherwise your metrics will probably get ignored by Graphite:

```js
var metrics = {foo: 23};
var timestamp = Date.now();
client.write(metrics, timestamp, function(err) {
  // if err is null, your data was sent to graphite!
});
```

## Todo

* More docs

## License

Licensed under the MIT license.
