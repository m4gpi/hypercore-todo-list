module.exports = function Item (params) {
  const { name } = params

  const self = {
    type: 'list/item',
    name
  }

  return Object.assign(self, {
    toString: () => (
      JSON.stringify(self, null, 2)
    )
  })
}
