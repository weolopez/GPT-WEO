const html = undefined
export class component {
    id
    cms
    element
    callbacks=[]
    currentHash
    constructor(element, cms) {
        this.id = element.id
        this.cms = cms
        this.element = element
        
        if (html) {
            let div = document.createElement('div')
            div.innerHTML = html
            element.appendChild(div)
        }
        
    }
    setHash(hash) {
        if (this.currentHash === hash) return

        let name = this.element.getAttribute('name')

        if (name) {
            name = name.replace(/ /g, '_')

            //if this.element attrubute name = hash then make viosible
            if (name === hash) {
                this.element.style.display = 'block'
            } else {
                this.element.style.display = 'none'
            }
        }

        this.currentHash = hash
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