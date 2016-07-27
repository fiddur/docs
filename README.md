# Auth0 Docs

Node version: 4.x
NPM version: 2.7.x

## Contribution Checklist

When you commit code to this repository, you should follow the following procedures.

* The commit message should clear on what what is being fixed/added
* The pull request should include any details about what is changed and how the change will be used
* If appropriate you should add a unit or functional test to verify the change
* All current tests should be run prior to sending your pull request
* Use ES6 syntax when possible
* Always run JSLint on code, when exception is applied mark it with an ignore statement in code and note why. Always reenable the ignore after the exception.
  ```js
  var y = Object.create(null);
  // ...
  /*jshint -W089 */
  // This is disabled because...
  for (var prop in y) {
      // ...
  }
  /*jshint +W089 */
  ```


## Development

### Setup and Usage without Vagrant
To run the docs site locally you will need to clone the auth0-docs server and the docs repo. You can make changes to the docs content inside the docs folder. You can branch/commit as normal from the docs folder. 

```
git clone https://github.com/auth0/auth0-docs
cd auth0-docs
git clone https://github.com/auth0/docs
nave use 4.x
npm i
npm run dev
```

Open the site on `http://localhost:3000/docs` in your browser.

> If you see an error like `Error: bind EMFILE` you need to run the following command `ulimit -n 2048`

### Usage with vagrant

Vagrant install production dependencies but not dev dependencies. Use this:

```
nave use 4.x
npm i
```

Running and deubgging in vagrant

```
sudo service auth0-docs start
sudo xtail auth0-docs | bunyan
```

### Updating the docs content

If you have a docs folder in the `auth0-docs` directory already, you should delete that. Make sure you save any work.

Then clone the docs repo in to the `auth0-docs` directory.

```
git clone https://github.com/auth0/docs.git
```

Now you can treat the `docs` folder as a regular repository. You can pull, branch, push, etc. as needed.

### Killing the server process

Sometimes it may happen that the Node server is not stopped properly preventing the website from working correctly. The typical symptom you will see when this happens is that the content being served is not correct. For example, you may make changes to Markdown files and those changes will not be reflected in the browser.

In this instance it will be necessarry to kill the process of the Node server.

First determine the PID of the process running on port 5050 (which will be the Node server) by running the `lsof` command:

``` bash
lsof -i :5050`
```

Now you can use the value in the **PID** column to kill that process, by running the command `kill <PID>`, e.g.

``` bash
kill 1234
```

Once this is done you can run the server again using `npm run dev`

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
