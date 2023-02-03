export class Component {
    id
    cms
    element
    callbacks=[]
    data
    constructor(element, cms, callback, html) {
        this.id = element.id
        this.cms = cms
        this.element = element
        this.addCallback(callback)
        if (html) {
            let div = document.createElement('div')
            div.innerHTML = html
            element.appendChild(div)
        }
    }
    save(data) {
        this.cms.save()
    }
    addCallback(callback) {
        if (callback) this.callbacks.push(callback)
    }
    callback(data) {
        this.callbacks.forEach(callback => {
            callback(data)
        })
    }
}