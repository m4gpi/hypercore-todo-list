# Hypercore Todo List

This is a really simple CLI for adding items to a todo list using Dat's [hypercore](https://github.com/mafintosh/hypercore) and [YARGS](http://yargs.js.org/). This is currently only writable by a single user.

Your hypercore instance (database and keys) can be found at `~/.hypercore-todo-list`.

To use the CLI:

```bash
# add an item to the list
node bin add --name <insert name here>

# remove an item from the list (soft delete)
node bin remove --id <insert ID here>

# find an item by its ID
node bin find <insert ID here>

# list all items
node bin list
```

## TODO: 
- [x] extract from the core application logic
- [] add multifeed and kappa-core to allow multiple people to write to the todo list
