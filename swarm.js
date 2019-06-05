const Discovery = require('hyperdiscovery')

module.exports = function swarm (hyperlist, callback) {
  callback = callback || noop

  hyperlist.getKey((err, key) => {
    if (err) return callbackk(err)

    hyperlist.feed((feed) => {
      const swarm = Discovery(feed, key)

      swarm.on('connection', (peer, type) => {
        var remoteKey = peer.id.toString('hex')

        hyperlist.feed((feed) => feed.replicate())
        hyperlist._addConnection(remoteKey)

        peer.on('close', function () {
          hyperlist._removeConnection(remoteKey)
        })
      })

      callback(null, swarm)
    })
  })
}

function noop () {}
