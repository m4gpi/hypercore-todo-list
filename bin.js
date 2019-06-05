const path = require('path')
const os = require('os')
const yargs = require('yargs')
const fs = require('fs')

const APP_NAME = require('./package.json').name
const APP_ROOT = path.join(os.homedir(), `.${APP_NAME}`)
const PUBLIC_KEY = '3e2b1dc5b649c2fd569c523ad5ecc27b5f8748d45eff7918df8712d473daf27a'

function App () {
  const HyperList = require('./index')

  const hyperlist = new HyperList(APP_ROOT, PUBLIC_KEY)

  hyperlist.feed((feed) => Command(feed))

  hyperlist.getKey(console.log)

  hyperlist.on('peer-added', (key) => {
    console.info(`${key} connected`)
  })

  hyperlist.on('peer-dropped', (key) => {
    console.log(`${key} dropped`)
  })

  function Command (feed) {
    return yargs
      .command('swarm', 'swarm to share your list', (argv) => {
        hyperlist.swarm((err, swarm) => callback(err, swarm))
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

      .command('find', 'find an item from the list by its ID', (argv) => {
        const id = argv.argv._[1]
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
