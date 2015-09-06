'use strict'

class Store {
  constructor(opts) {
    /**
     * opts:
     *   - db
     *   - store
     *   - indexes
     */
    this.opts = opts || {}
    this.storeOpts = this.opts.store || {}
  }

  init() {
    const dbname = this.opts.db || 'test'
    const storeName = this.storeName = this.storeOpts.name || 'item'
    const indexes = this.opts.indexes || []

    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbname)

      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve(this.db)
      }

      request.onerror = (event) => {
        let err = new Error('open indexedDB error')
        err.code = event.target.errorCode

        reject(err)
      }

      request.onupgradeneeded = (event) => {
        const opts = this.storeOpts
        const name = opts.name
        /**
         * @param {Object} opts
         *   - keyPath: such as `id`
         *   - autoIncrement: such as `true`
         */
        this.store = event.currentTarget.result.createObjectStore(name, opts)
        /**
         * @param {Object} index
         *   - name
         *   - property
         *   - unique
         */
        indexes.forEach((index) => {
          let unique = !!index.unique
          this.store.createIndex(index.name, index.property, {
            unique
          })
        })
      }
    })
  }

  /**
   * @param {String} type
   * @param {Array} items
   */
  _run(type, items) {
    const transaction = this.db.transaction([this.storeName], 'readwrite')

    let results = []

    return new Promise((resolve, reject) => {
      const objectStore = transaction.objectStore(this.storeName)

      for (let item of items) {
        let request = objectStore[type](item)

        request.onsuccess = (event) => {
          // TODO: order the result
          results.push(event.target.result)
        }
      }

      transaction.oncomplete = () => {
        resolve(results)
      }

      transaction.onerror = (event) => {
        let err = new Error('transaction error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }

  _get(keys) {
    const transaction = this.db.transaction([this.storeName], 'readonly')

    let results = []

    return new Promise((resolve, reject) => {
      const objectStore = transaction.objectStore(this.storeName)

      for (let key of keys) {
        let request = objectStore.get(key)

        request.onsuccess = (event) => {
          // TODO: order the results
          results.push(event.target.result)
        }
      }

      transaction.oncomplete = () => {
        resolve(results)
      }

      transaction.onerror = (event) => {
        let err = new Error('transaction error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }

  add(...items) {
    if (items.length > 1) {
      return this._run('add', items)
    }

    return this
      ._run('add', items)
      .then((results) => {
        return results[0]
      })
  }

  put(...items) {
    if (items.length > 1) {
      return this._run('put', items)
    }

    return this
      ._run('put', items)
      .then((results) => {
        return results[0]
      })
  }

  remove(...keys) {
    if (keys.length > 1) {
      return this._run('delete', keys)
    }

    return this
      ._run('delete', keys)
      .then((results) => {
        return results[0]
      })
  }

  get(...keys) {
    if (keys.length > 1) {
      return this._get(keys)
    }

    return this
      ._get(keys)
      .then((results) => {
        return results[0]
      })
  }

  find(name, range) {
    const transaction = this.db.transaction([this.storeName], 'readonly')
    const index = transaction.objectStore(this.storeName).index(name)

    return new Promise((resolve, reject) => {
      let request = index.openCursor(range)

      request.onsuccess = (event) => {
        resolve(event.target.result)
      }

      request.onerror = (event) => {
        let err = new Error('find by cursor error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }

  // get by index
  findOne(name, value) {
    const transaction = this.db.transaction([this.storeName], 'readonly')
    const index = transaction.objectStore(this.storeName).index(name)

    return new Promise((resolve, reject) => {
      let request = index.get(value)

      request.onsuccess = (event) => {
        resolve(event.target.result)
      }

      request.onerror = (event) => {
        let err = new Error('get by index error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }
}

export default Store
