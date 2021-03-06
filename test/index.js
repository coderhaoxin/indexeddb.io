
import { strictEqual as equal } from 'assert'
import Store from '../'

describe('## indexeddb.io', () => {
  describe('# basic', () => {
    const store = new Store({
      db: 'test01',
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

    it('init', () => {
      return store.init()
    })

    it('add', () => {
      return store.add({
        name: 'haoxin',
        desc: 'hello'
      })
      .then(result => {
        id = result
      })
    })

    it('add another', () => {
      return store.add({
        name: 'another haoxin',
        desc: 'another hello'
      })
    })

    it('get', () => {
      return store.get(id)
        .then(result => {
          equal(result.name, 'haoxin')
          equal(result.desc, 'hello')
        })
    })

    it('put', () => {
      return store.put({
        id: id,
        name: 'haoxin',
        desc: 'hello world'
      })
    })

    it('get', () => {
      return store.get(id)
        .then(result => {
          equal(result.name, 'haoxin')
          equal(result.desc, 'hello world')
        })
    })

    it('findOne', () => {
      return store.findOne()
        .then(result => {
          equal(result.name, 'haoxin')
        })
    })

    it('findOne by - name, value', () => {
      return store.findOne('name', 'haoxin')
        .then(result => {
          equal(result.name, 'haoxin')
        })
    })

    it('find', () => {
      return store.find()
        .then(items => {
          equal(items.length, 2)
          equal(items[0].name, 'haoxin')
          equal(items[1].name, 'another haoxin')
        })
    })

    it('find by - name, value', () => {
      return store.find('name', 'haoxin')
        .then(items => {
          equal(items.length, 1)
          equal(items[0].name, 'haoxin')
        })
    })

    it('find by - name, keyRange', () => {
      return store.find('name', IDBKeyRange.only('haoxin'))
        .then(items => {
          equal(items.length, 1)
          equal(items[0].name, 'haoxin')
        })
    })

    it('remove', () => {
      return store.remove(id)
    })

    it('count should be: 1', () => {
      return store.count().then(count => {
        equal(count, 1)
      })
    })

    it('clear', () => {
      return store.clear()
    })

    it('count should be: 0', () => {
      return store.count().then(count => {
        equal(count, 0)
      })
    })
  })

  describe('# findAndRemove - no range', () => {
    const store = new Store({
      db: 'test02',
      store: {
        name: 'item',
        keyPath: 'id',
        autoIncrement: true
      },
      indexes: [{
        name: 'name',
        property: 'name',
        unique: false
      }]
    })

    it('init', () => {
      return store.init()
    })

    it('add', () => {
      return store.add({
        name: 'haoxin',
        desc: 'hello'
      })
    })

    it('add', () => {
      return store.add({
        name: 'haoxin',
        desc: 'hello'
      })
    })

    it('findAndRemove', () => {
      return store.findAndRemove()
    })

    it('count should be: 0', () => {
      return store.count().then(count => {
        equal(count, 0)
      })
    })
  })

  describe('# findAndRemove - with range', () => {
    const store = new Store({
      db: 'test02',
      store: {
        name: 'item',
        keyPath: 'id',
        autoIncrement: true
      },
      indexes: [{
        name: 'name',
        property: 'name',
        unique: false
      }]
    })

    it('init', () => {
      return store.init()
    })

    it('add', () => {
      return store.add({
        name: 'haoxin',
        desc: 'hello'
      })
    })

    it('add', () => {
      return store.add({
        name: 'haoxin',
        desc: 'hello'
      })
    })

    it('findAndRemove', () => {
      return store.findAndRemove('name', 'haoxin')
    })

    it('count should be: 0', () => {
      return store.count().then(count => {
        equal(count, 0)
      })
    })
  })
})
