const html = undefined
export class component {
    id
    cms
    element
    callbacks=[]
    currentHash
    constructor(element, cms) {

        this.cms = cms
        this.element = element
        this.id = element.id
        if (html) {
            let div = document.createElement('div')
            div.innerHTML = html
            element.appendChild(div)
        }
        document.addEventListener('ComponentEvent', this.eventListener.bind(this), false);
    }
    triggerEvent(event_name='ComponentEvent',component) {
        const event = new CustomEvent(event_name, 
            { detail: component });
        document.dispatchEvent(event);
    }
    eventListener(e) {
        // console.log('eventListener', e)
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


// Define the new element
// customElements.define('popup-info', PopUpInfo);