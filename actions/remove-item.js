const crypto = require('crypto')

module.exports = RemoveItem

RemoveItem.toString = 'list/remove-item'

function RemoveItem (params) {
  const { id, itemId, createdAt } = params

  const self = {
    id: id || crypto.randomBytes(32).toString('hex'),
    type: 'list/remove-item',
    itemId: itemId,
    createdAt: createdAt || Date.now()
  }

  return Object.assign(self, {
    toString: () => (
      JSON.stringify(self, null, 2)
    )
  })
}
