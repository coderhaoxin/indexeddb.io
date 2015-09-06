'use strict'

import { expect } from 'chai'
import Store from '../'

describe('## indexeddb.io', () => {
  describe('# basic', () => {
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

    it('init', () => {
      return store.init()
    })

    it('add', () => {
      return store.add({
        name: 'haoxin',
        desc: 'hello'
      })
      .then((result) => {
        id = result
      })
    })

    it('get', () => {
      return store.get(id)
        .then((result) => {
          expect(result.name).to.equal('haoxin')
          expect(result.desc).to.equal('hello')
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
        .then((result) => {
          expect(result.name).to.equal('haoxin')
          expect(result.desc).to.equal('hello world')
        })
    })

    it('findOne', () => {
      return store.findOne('name', 'haoxin')
        .then((result) => {
          expect(result.name).to.equal('haoxin')
        })
    })

    it('find', () => {
      return store.find('name')
        .then((cursor) => {
          expect(cursor.value.name).to.equal('haoxin')
        })
    })

    it('find with keyRange', () => {
      return store.find('name', IDBKeyRange.only('haoxin'))
        .then((cursor) => {
          expect(cursor.value.name).to.equal('haoxin')
        })
    })

    it('remove', () => {
      return store.remove(id)
    })
  })
})
