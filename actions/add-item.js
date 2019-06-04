const crypto = require('crypto')

module.exports = AddItem

AddItem.type = 'list/add-item'

function AddItem (params) {
  const { id, name, createdAt } = params

  const self = {
    id: id || crypto.randomBytes(32).toString('hex'),
    type: 'list/add-item',
    name,
    createdAt: createdAt || Date.now()
  }

  return Object.assign(self, {
    toString: () => (
      JSON.stringify(self, null, 2)
    )
  })
}
