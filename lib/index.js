
class Store {
  constructor(opts = {}) {
    /**
     * opts:
     *   - db
     *   - store
     *   - indexes
     */
    this.opts = opts
    this.storeOpts = this.opts.store || {}
  }

  init() {
    const dbname = this.opts.db || 'test'
    const storeName = this.storeName = this.storeOpts.name || 'item'
    const indexes = this.opts.indexes || []

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbname)

      request.onsuccess = event => {
        this.db = event.target.result
        resolve(this.db)
      }

      request.onerror = event => {
        let err = new Error('open indexedDB error')
        err.code = event.target.errorCode

        reject(err)
      }

      request.onupgradeneeded = event => {
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
        indexes.forEach(index => {
          let unique = !!index.unique
          this.store.createIndex(index.name, index.property, {
            unique
          })
        })
      }
    })
  }

  getObjectStore(mode) {
    const transaction = this.db.transaction([this.storeName], mode)
    return transaction.objectStore(this.storeName)
  }

  /**
   * @param {String} type
   * @param {Array} items
   */
  _run(type, items) {
    const transaction = this.db.transaction([this.storeName], 'readwrite')

    const results = []

    return new Promise((resolve, reject) => {
      const objectStore = transaction.objectStore(this.storeName)

      for (let item of items) {
        let request = objectStore[type](item)

        request.onsuccess = event => {
          // TODO: order the result
          results.push(event.target.result)
        }
      }

      transaction.oncomplete = () => {
        resolve(results)
      }

      transaction.onerror = event => {
        let err = new Error('transaction error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }

  _get(keys) {
    const transaction = this.db.transaction([this.storeName], 'readonly')

    const results = []

    return new Promise((resolve, reject) => {
      const objectStore = transaction.objectStore(this.storeName)

      for (let key of keys) {
        let request = objectStore.get(key)

        request.onsuccess = event => {
          // TODO: order the results
          results.push(event.target.result)
        }
      }

      transaction.oncomplete = () => {
        resolve(results)
      }

      transaction.onerror = event => {
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
      .then(results => {
        return results[0]
      })
  }

  put(...items) {
    if (items.length > 1) {
      return this._run('put', items)
    }

    return this
      ._run('put', items)
      .then(results => {
        return results[0]
      })
  }

  remove(...keys) {
    if (keys.length > 1) {
      return this._run('delete', keys)
    }

    return this
      ._run('delete', keys)
      .then(results => {
        return results[0]
      })
  }

  get(...keys) {
    if (keys.length > 1) {
      return this._get(keys)
    }

    return this
      ._get(keys)
      .then(results => {
        return results[0]
      })
  }

  find(name, range) {
    const transaction = this.db.transaction([this.storeName], 'readonly')
    const objectStore = transaction.objectStore(this.storeName)

    const items = []

    if (!name) {
      return new Promise((resolve, reject) => {

        transaction.oncomplete = () => {
          resolve(items)
        }

        const request = objectStore.openCursor()

        request.onsuccess = event => {
          const cursor = event.target.result
          if (cursor) {
            items.push(cursor.value)
            cursor.continue()
          }
        }

        request.onerror = event => {
          let err = new Error('find by cursor error')
          err.code = event.target.errorCode
          reject(err)
        }
      })
    }

    // find by - name, range
    return new Promise((resolve, reject) => {
      const index = objectStore.index(name)
      const request = index.openCursor(range)

      transaction.oncomplete = () => {
        resolve(items)
      }

      request.onsuccess = event => {
        const cursor = event.target.result
        if (cursor) {
          items.push(cursor.value)
          cursor.continue()
        }
        // resolve(event.target.result)
      }

      request.onerror = event => {
        let err = new Error('find by cursor error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }

  findAndRemove(name, range) {
    const transaction = this.db.transaction([this.storeName], 'readwrite')
    const objectStore = transaction.objectStore(this.storeName)

    if (!name) {
      return new Promise((resolve, reject) => {

        transaction.oncomplete = () => {
          resolve()
        }

        const request = objectStore.openCursor()

        request.onsuccess = event => {
          const cursor = event.target.result
          if (cursor) {
            cursor.delete()
            cursor.continue()
          }
        }

        request.onerror = event => {
          let err = new Error('find and remove error')
          err.code = event.target.errorCode
          reject(err)
        }
      })
    }

    // find by - name, range
    return new Promise((resolve, reject) => {
      const index = objectStore.index(name)
      const request = index.openCursor(range)

      transaction.oncomplete = () => {
        resolve()
      }

      request.onsuccess = event => {
        const cursor = event.target.result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }

      request.onerror = event => {
        let err = new Error('find and remove error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }

  findOne(name, value) {
    const objectStore = this.getObjectStore('readonly')

    if (!name) {
      return new Promise((resolve, reject) => {
        const request = objectStore.openCursor()

        request.onsuccess = event => {
          const cursor = event.target.result
          if (cursor) {
            resolve(cursor.value)
          } else {
            resolve(null)
          }
        }

        request.onerror = event => {
          let err = new Error('find one error')
          err.code = event.target.errorCode
          reject(err)
        }
      })
    }

    // get by index
    return new Promise((resolve, reject) => {
      const index = objectStore.index(name)
      const request = index.get(value)

      request.onsuccess = event => {
        resolve(event.target.result)
      }

      request.onerror = event => {
        let err = new Error('find one by index error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }

  count() {
    const objectStore = this.getObjectStore('readonly')

    return new Promise((resolve, reject) => {
      const request = objectStore.count()

      request.onsuccess = event => {
        resolve(event.target.result)
      }

      request.onerror = event => {
        const err = new Error('count error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }

  clear() {
    const objectStore = this.getObjectStore('readwrite')

    return new Promise((resolve, reject) => {
      const request = objectStore.clear()

      request.onsuccess = event => {
        resolve(event.target.result)
      }

      request.onerror = event => {
        const err = new Error('clear error')
        err.code = event.target.errorCode
        reject(err)
      }
    })
  }
}

export default Store
