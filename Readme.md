# graphite

A node.js client for graphite.

## Is it any good?

Try it : ).

## Usage

Sending data:

```js
var graphite = require('graphite');
var carbonClient = graphite.createCarbonClient('plaintext://your-graphite-host/');

var key = 'foo.bar.baz';
var value = 23;
carbonClient.write(key, value, function(err) {
  if (err) throw err;
});
```

## Todo

* More docs
* Maybe implement the pickle / AMQP protocols for sending data
* Unit tests

## License

Licensed under the MIT license.
