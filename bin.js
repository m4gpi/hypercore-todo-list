const hypercore = require('hypercore')
const path = require('path')
const os = require('os')
const yargs = require('yargs')

const APP_NAME = require('./package.json').name
const APP_ROOT = path.join(os.homedir(), `.${APP_NAME}`)

const Item = require('./models/item')

const _feed = hypercore(APP_ROOT, { createIfMissing: true, overwrite: false })

function command (feed) {
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

    .command('get', 'get an item from your list', (argv) => {
      const index = argv.argv._[1]
      if (isNaN(index)) return callback(new Error(`${index} is not a number.`))
      feed.get(index, { valueEncoding: 'json' }, (err, item) => {
        if (err) callback(err)
        else callback(null, new Item(item))
      })
    })

    .command('display', 'display your entire list', () => {
      var stream = feed.createReadStream({ start: 0, end: feed.length })

      const items = []
      stream.on('data', (chunk) => {
        const item = JSON.parse(chunk.toString())
        items.push(new Item(item))
      }).on('end', () => {
        callback(null, items)
      })
    })

    .argv
}

function callback (err, res) {
  if (err) throw err
  console.log(res)
}

_feed.on('ready', () => {
  const args = command(_feed)

  if (!args._[0]) {
    yargs.showHelp()
    _feed.close()
  }
})
