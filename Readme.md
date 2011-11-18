# graphite

A node.js client for graphite.

## Install

This is not ready for you yet

## Usage

Sending data:

```js
var graphite = require('graphite');
var client = graphite.createClient('plaintext://graphite.example.org:2003/');

var metrics = {foo: 23};
carbonClient.write(metrics, function(err) {
  // if err is null, your data was sent to graphite!
});
```

## Todo

* More docs

## License

Licensed under the MIT license.
