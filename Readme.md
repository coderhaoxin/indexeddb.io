
[![NPM version][npm-img]][npm-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### indexeddb.io

* Promise based API wrapper for indexeddb.

### Usage

```js
import Store from 'indexeddb.io'

const store = new Store({
  db: 'test',
  store: {
    name: 'item',
    keyPath: 'id',
    autoIncrement: true
  },
  indexes: [{
    name: 'name',
    property: 'name',
    unique: true
  }]
})

let id

store.init().then(...)

// add

store.add({
  name: 'haoxin',
  desc: 'hello'
})

// get

store.get(id)

// put

store.put({
  id: id,
  name: 'haoxin',
  desc: 'hello world'
})

// findOne

store.findOne('name', 'haoxin')

// find

store.find('name')
  .then((cursor) => {})

store.find('name', IDBKeyRange.only('haoxin'))
  .then((cursor) => {})

// remove

store.remove(id)
```

### License
MIT

[npm-img]: https://img.shields.io/npm/v/storage.io.svg?style=flat-square
[npm-url]: https://npmjs.org/package/storage.io
[travis-img]: https://img.shields.io/travis/onebook/storage.io.svg?style=flat-square
[travis-url]: https://travis-ci.org/onebook/storage.io
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/onebook/storage.io.svg?style=flat-square
[david-url]: https://david-dm.org/onebook/storage.io
