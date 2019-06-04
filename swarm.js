const Discovery = require('hyperdiscovery')

module.exports = function swarm (hyperlist, callback) {
  callback = callback || noop

  hyperlist.getKey((err, key) => {
    if (err) return callbackk(err)

    hyperlist.feed((feed) => {
      const swarm = Discovery(feed, key)
      swarm.on('connection', (peer, type) => {
        console.log("Current number of connections: ", swarm.totalConnections)

        var remoteKey = peer.id.toString('hex')
        console.info(`${remoteKey} connected`)

        hyperlist.replicate()
        hyperlist.addConnection(remoteKey)

        peer.on('close', function () {
          console.log(`${remoteKey} dropped`)
        })
      })

      callback(null, swarm)
    })
  })
}

function noop () {}
