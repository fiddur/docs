Node version: 0.10.30
NPM version: 1.4.21

## Development

### Usage without Vagrant

```
nave use 0.10.30
git submodule init
git submodule update
npm i
mongod &
npm run watch
```

> If you see an error like `Error: bind EMFILE` you need to run the following command `ulimit -n 2048`

### Usage with vagrant

Vagrant install production dependencies but not dev dependencies. Use this:

```
nave use 0.10.30
git submodule init
git submodule update
npm i
```

## Installing or Updating dependencies

**Do not update npm-shrinkwrap.json by hand**

Use this procedure:
```

npm i foo@~1.2.3 --save
npm run shrinkwrap
```
```
make test
```

If you want verbose logs use:

```
make test TEST_DEBUG_LEVEL=debug
```

## Testing the shrinkwrap status

```
make test-shrinkwrap-status
```

## Testing dependencies (node-security)

```
make test-sec-deps
```
