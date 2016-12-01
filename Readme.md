
[![NPM version][npm-img]][npm-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### indexeddb.io

* Promise based API wrapper for indexeddb.

### APIs

* store
  - `init`

  - `add`
  - `put`
  - `get`
  - `remove`

  - `find`
  - `findOne`
  - `findAndRemove`

  - `count`
  - `clear`

* index

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
.then(result => {
  id = result
})

// get

store.get(id)

// put

store.put({
  id,
  name: 'haoxin',
  desc: 'hello world'
})

// findOne

store.findOne('name', 'haoxin')

// find

store.find()

store.find('name', IDBKeyRange.only('haoxin'))

// findAndRemove

store.findAndRemove('name', IDBKeyRange.only('haoxin'))

// remove

store.remove(id)
```

### License
MIT

[npm-img]: https://img.shields.io/npm/v/indexeddb.io.svg?style=flat-square
[npm-url]: https://npmjs.org/package/indexeddb.io
[travis-img]: https://img.shields.io/travis/coderhaoxin/indexeddb.io.svg?style=flat-square
[travis-url]: https://travis-ci.org/coderhaoxin/indexeddb.io
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/coderhaoxin/indexeddb.io.svg?style=flat-square
[david-url]: https://david-dm.org/coderhaoxin/indexeddb.io
