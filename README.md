# Hypercore Todo List

This is a really simple CLI for adding items to a todo list using Dat's [hypercore](https://github.com/mafintosh/hypercore) and [YARGS](http://yargs.js.org/). This is currently only writable by a single user.

Your hypercore instance (database and keys) can be found at `~/.hypercore-todo-list`.

To use the CLI:

```bash
# add an item to the list
node bin add --name item

# get an item by index
node bin get 1

# display all items
node bin display
```

## TODO: 
- Share the discovery key on the DHT and get bash a hash to share with friends
- Add multifeed and kappa-core to allow multiple people to write to the todo list 
- Implement the MVC pattern - build out a set of controllers and models - extract from the core application logic 
