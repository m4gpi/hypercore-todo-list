const path = require('path')
const os = require('os')
const yargs = require('yargs')
const fs = require('fs')

const APP_NAME = require('./package.json').name
const APP_ROOT = path.join(os.homedir(), `.${APP_NAME}`)
const PUBLIC_KEY = 'a603500817d4f9dbbaa96b9421856156641833e361ee63d391d561a5375d9939'

function App () {
  const HyperList = require('./index')

  const hyperlist = new HyperList(APP_ROOT, PUBLIC_KEY)

  hyperlist.feed((feed) => Command(feed))

  function Command (feed) {
    return yargs
      .command('swarm', 'swarm to share your list', (argv) => {
        hyperlist.swarm((swarm) => callback(null, swarm))
      })

      .command('add', 'add an item to your list', (yargs) => {
        yargs.positional('name', {
          demandOption: true,
          type: 'string'
        })
      }, (argv) => {
        const { name } = argv
        hyperlist.add({ name }, callback)
      })

      .command('remove', 'remove an item from your list', (yargs) => {
        yargs.positional('id', {
          demandOption: true,
          type: 'string'
        })
      }, (argv) => {
        const { id } = argv
        hyperlist.remove({ itemId: id }, callback)
      })

      .command('find', 'find an item from the list by its ID', (yargs) => {
        yargs.positional('id', {
          demandOption: true,
          type: 'string'
        })
      }, (argv) => {
        const { id } = argv
        hyperlist.find(id, callback)
      })

      .command('list', 'display your entire list', () => {
        hyperlist.list(callback)
      })

      .argv
  }

  function callback (err, res) {
    if (err) throw err
    console.log(res)
  }
}

App()
