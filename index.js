const hypercore = require('hypercore')
const path = require('path')
const os = require('os')
const yargs = require('yargs')

const APP_NAME = require('package.json').name
const APP_ROOT = path.join(os.homedir(), `.${APP_NAME}`)

const Item = require('./models/item')

const _feed = hypercore(APP_ROOT, { createIfMissing: true, overwrite: false })

function processCommand (feed) {
  return yargs
    .command('add', 'add an item to your list', (yargs) => {
      yargs.positional('name', {
        describe: 'give the item a name',
        demandOption: true,
        type: 'string'
      })
    }, (argv) => {
      const { name } = argv
      const item = new Item({ name })
      feed.append(item.toString(), callback)
    })

    .command('get', 'get an item from your list', (yargs) => {
      yargs.positional('index', {
        describe: 'pass an index',
        demandOption: true,
        type: 'integer'
      })
    }, (argv) => {
      const { index } = argv
      feed.get(index, { valueEncoding: 'json' }, callback)
    })

    .command('display', 'display your entire list', (argv) => {
      var stream = feed.createReadStream({ start: 0, end: feed.length })

      const items = []
      stream.on('data', (chunk) => {
        const item = JSON.parse(chunk.toString())
        items.push(item)
      }).on('end', () => {
        callback(null, items)
      })
    })

    .argv
}

function log (data) {
  console.log(data)
}

function callback (err, res) {
  if (err) throw err
  log(res)
}

_feed.on('ready', () => {
  const yargsargs = processCommand(_feed)

  if (!yargsargs._[0]) {
    yargs.showHelp()
    _feed.close()
  }
})
