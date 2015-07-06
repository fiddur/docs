Node version: 0.10.30
NPM version: 1.4.21

## Contribution Checklist
When you commit code to this repository, you should follow the following procedures.

* The commit message should clear on what what is being fixed/added
* The pull request should include any details about what is changed and how the change will be used
* If appropriate you should add a unit or functional test to verify the change
* All current tests should be run prior to sending your pull request


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

Running in vagrant with watch

```
sudo service auth0-docs stop
NODE_ENV=production CONFIG_FILE=/etc/auth0-docs.json npm run watch
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
