import { Collection } from '/ai/collection/collection.js'

export class CMS {
    page = {}
    classes = {}
    cms
    hash=''
    constructor() {
        this.initPage()
        this.cms = new Collection('cms')
    }

    initPage() {
        let pageMetaElements = document.getElementsByTagName('meta')
        this.page.meta = {}
        for (let i = 0; i < pageMetaElements.length; i++) {
            this.page.meta[pageMetaElements[i].name] = pageMetaElements[i].content
        }
        this.page.title = document.title
        this.page.url = window.location.href
        this.page.path = window.location.pathname
        this.id = this.page.meta.id
        this.page.data = {}

        window.addEventListener('hashchange', function () {
            this.setHash()
        }.bind(this))
    }
    setHash() {
        this.hash = window.location.href.split('#')[1]
        //if hash is empty then set hash to page title
        if (!this.hash) window.location.hash = this.page.title
        // this.hash = this.page.title
        this.hash = this.hash.replace(/ /g, '_')
        if (!this.hash) return
        for (let key in this.page.componentObject) {
            this.page.componentObject[key].setHash(this.hash)
        }
    }

    //TODO remove from cms and allow components to initialize themselves
    async initComponents() {
        await this.cms.getByName(this.page.meta.id).then((data) => {
            this.page.data = data
        })
        if (!this.page.data) this.page.data = {}

        //get all the elements with the cms class to create objects
        this.page.elements = document.getElementsByClassName('cms')
        this.page.componentObject = {}
        //for each element load modules TODO allow components to initialize themselves
        for (let i = 0; i < this.page.elements.length; i++) {
            let element = this.page.elements[i]
            let id = element.id
            let modules = element.getAttribute('data-modules')
            let components = {}
            let webcomponents = {}

            if (modules && components[modules] === undefined) {
                components[modules] = await import(`/ai/cms/${modules}/${modules}.js`)
            }
            
            if (components[modules]) {
                this.classes[modules] = components[modules][modules]
                this.page.componentObject[id] = new this.classes[modules](element, this)
            } else {
                element.innerText = this.page.data[element.id]
                if (this.page.data.links && this.page.data.links[element.id]) {
                    // create an onclick event for the element that will set the href
                    // to the link in this.page.data.links[element.id] 
                    element.onclick = () => {
                        window.location.href = this.page.data.links[element.id]
                    }
                }
                //if element attribute data-for move the element into the element with the id of data-for
                //TODO remove from cms
                if (element.getAttribute('data-for')) {
                    document
                        .getElementById(element.getAttribute('data-for'))
                        .appendChild(element)

                }
            }
            //get the tag name of the element
            modules = element.tagName.toLowerCase()
            modules = modules.replace(/-/g, '')
            if (modules && webcomponents[modules] === undefined) {
                try {
                    webcomponents[modules] = await import(`/ai/component/${modules}/${modules}.js`)
                } catch (e) {
                    console.log(e)
                }
            }

        }

        this.setHash()
        this.isEdit()

        //change body visibility to visible
        document.body.style.visibility = 'visible'
    }
    //TODO refactor out
    async isEdit() {
        if (localStorage.getItem('enableEditor') !== 'true') return
        let cmsEdit = await import(`/ai/cms/edit/edit.js`)
        let editor = new cmsEdit.CMSEditor(this)
    }
    findElement(id) {
        for (let i = 0; i < this.page.elements.length; i++) {
            let element = this.page.elements[i]
            if (element.id === id) {
                return element
            }
        }
    }
    async save() {
        this.page.data.name = this.page.meta.id
        let method = (this.page.data._id) ? 'PUT' : 'POST'
        return await fetch(`/crud/cms`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.page.data)
        }).then(response => response.json()).catch(() => {
            console.log("error");
        }).then((data) => {
            // sessionStorage.setItem(data.name, JSON.stringify(data))
            return data
        })
    }
}