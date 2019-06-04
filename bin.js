const hypercore = require('hypercore')
const path = require('path')
const os = require('os')
const yargs = require('yargs')
const fs = require('fs')

const APP_NAME = require('./package.json').name
const APP_ROOT = path.join(os.homedir(), `.${APP_NAME}`)
const PUBLIC_KEY = 'a603500817d4f9dbbaa96b9421856156641833e361ee63d391d561a5375d9939'

const Item = require('./models/item')
const swarm = require('./swarm')

const _feed = fs.existsSync(`${APP_ROOT}/secret_key`)
  ? hypercore(APP_ROOT)
  : hypercore(APP_ROOT, PUBLIC_KEY)

function command (feed) {
  return yargs
    .command('share', 'share your list', (argv) => {
      swarm(feed)
    })

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

  fs.existsSync(`${APP_ROOT}/secret_key`) ? null :  _feed.replicate()

  if (!args._[0]) {
    yargs.showHelp()
    _feed.close()
  }
})
