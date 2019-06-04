const events = require('events')
const inherits = require('inherits')
const hypercore = require('hypercore')
const thunky = require('thunky')

const AddItem = require('./actions/add-item')
const RemoveItem = require('./actions/remove-item')

const swarm = require('./swarm')

module.exports = HyperList

function HyperList (storage, key, opts) {
  if (!(this instanceof HyperList)) return new HyperList(storage, key, opts)
  if (!opts) opts = {}
  events.EventEmitter.call(this)

  this.key = key || null

  var self = this
  this.feed = thunky(function (callback) {
    const feed = hypercore(storage)

    feed.on('ready', () => {
      if (!self.key) self.key = feed.key.toString('hex')
      callback(feed)
    })
  })

  this.findById = function (id, callback) {
    this.feed((feed) => {
      var stream = feed.createReadStream({ start: 0, end: feed.length })

      var found
      stream.on('data', (chunk) => {
        var record = JSON.parse(chunk.toString())
        if (record.id === id) {
          found = record
          stream.destroy()
        }
      }).on('end', () => {
        callback(new Error('No record matching this ID'))
      }).on('close', () => {
        callback(null, found)
      })
    })
  }
}

inherits(HyperList, events.EventEmitter)

HyperList.prototype.find = function (id, callback) {
  this.findById(id, callback)
}

HyperList.prototype.add = function (params, callback) {
  if (!callback) callback = noop
  if (!params) return callback(new Error('You must pass a set of parameters to create a new item'))

  this.feed((feed) => {
    var item = new AddItem(params)
    feed.append(item.toString(), function (err) {
      callback(err, err ? null : item)
    })
  })
}

HyperList.prototype.remove = function (params, callback) {
  if (!callback) callback = noop
  if (!params) return callback(new Error('You must pass a set of parameters to remove a new item'))

  // validate presence of itemId param...

  this.feed((feed) => {
    var removal = new RemoveItem(params)
    feed.append(removal.toString(), function (err) {
      callback(err, err ? null : removal)
    })
  })
}

HyperList.prototype.list = function (callback) {
  if (!callback) callback = noop

  this.feed((feed) => {
    var stream = feed.createReadStream({ start: 0, end: feed.length })

    const items = []
    stream.on('data', (chunk) => {
      const data = JSON.parse(chunk.toString())
      switch (data.type) {
        case AddItem.type:
          items.push(new AddItem(data))
        case RemoveItem.type:
          const index = items.map(item => item.id).indexOf(data.itemId)
          if (index !== -1) items.splice(index, 1)
      }
    }).on('end', () => {
      callback(null, items)
    })
  })
}

HyperList.prototype.swarm = function (callback) {
  swarm(this, callback)
}

HyperList.prototype.getKey = function (callback) {
  if (!callback) return

  this.feed((feed) => {
    callback(null, feed.key.toString('hex'))
  })
}

HyperList.prototype._addConnection = function (key) {
  this.emit('peer-added', key)
}

HyperList.prototype._removeConnection = function (key) {
  this.emit('peer-dropped', key)
}

function noop () {}
