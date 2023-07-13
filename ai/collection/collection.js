import { get, post, put, remove, getNames, getByName, upsert } from '/ai/collection/document.js'
export class Collection {
    collection
    callbacks=[]

    constructor(collection, callback) {
        this.addCallback(callback)
        this.collection = collection;
    }
    callback(data) {
        if (this.callbacks.length == 0) return
        this.callbacks.forEach(callback => {
            callback(data)
        })
    }
    addCallback(callback) { if (callback) this.callbacks.push(callback) }

    get(id = '') {
            return get(this.collection, id)
                .then(data => {
                    this.callback(data)
                    return data
                })
    }

    async add(obj) {
        return await post(this.collection, obj).then(data => {
            this.get(data._id)
            return data
        })
    }

    async update(obj) {
        put(this.collection, obj).then(data => {
                this.get(obj._id)
        })
    }
    async upsert(obj, arrayName) {
        upsert(this.collection, arrayName, obj).then(data => {
                this.get(obj._id)
        })
    }
    async remove(obj) {
        remove(this.collection, obj).then(data => {
                this.get()
        })
    }
    async getNames() {
        return await getNames(this.collection).then(data => {
            return data
        })
    }
    async getByName(name) {
        return await getByName(this.collection, name).then(data => {
            return data
        })
    }

}

