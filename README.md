It provide the setTimeout with keepalive beacon. 

The following code will timeout and throws `Keepalive.Timeout` error 10 seconds after the last event.

# Basic Usage

It throws `KeepaliveTimeout` 10 seconds after the last event.

```javascript
const { setKeepalive } = require('set-keepalive')
// import { setKeepalive } from 'set-keepalive'

await setKeepalive(async beacon => {
  const worker = new SomeWorker()
  worker.on('event', ev => {
    beacon()
    // Process the event
  })
  await worker.start()
}, 10 * 1000)
```

# Options

```javascript
await Keepalive.setTimeout(async beacon => {
  // worker
}, {
  timeout: 10 * 1000,
  interval: 1000,
  timeoutMessage: 'timeout',
})
```

## timeout

Milliseconds to timeout from the last beacon. Default value is 10 seconds (10,000ms).

## interval

Milliseconds to evaluate timeout. Default value is 1 second (1,000ms).

## tiemoutMessage

Error message of `KeepaliveTimeout`. Default value is `timeout`.
