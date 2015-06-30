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

## API

All document content is accessible through the docs API as well as through regular HTML.

To request a document in embedded format (i.e. no template html) to embed externally simply append `?e=1` to any url.

To request content in JSON or JSONP format simply pass the header `Accept: 'application/json'` and optionally specify a ``?callback=foo` query parameter for JSONP.

In the JSON or JSONP responses you can also request the document metadata by appending `?m=1` to the query.

## Code snippets
Code snippets are available both through the API and to use in markdown docs.

Access via API:

GET: `/docs/meta/snippets/{hash}`
Response:
```json
{
  "title": "{title}",
  "content": "{<pre><code class="{class}">{code}</code></pre> }",
  "hash": "{hash}"
  "additional_metadata": ""
}
```

Access via Markdown docs:

```md
@@snippets.findByHash('{hash}').content@@
```
