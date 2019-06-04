const Discovery = require('hyperdiscovery')

module.exports = function swarm (feed) {
  const discovery = Discovery(feed)
  console.log("Peer ID: ", discovery.id.toString('hex'))

  discovery.on('connection', (peer, type) => {
    console.log("No of connections: ", discovery.totalConnections)
    console.log("Peer connected: ", peer.id.toString('hex'))

    peer.on('close', function () {
      console.log('peer disconnected')
    })
  })

  return discovery
}
