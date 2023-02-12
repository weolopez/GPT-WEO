import { Collection } from '/ai/collection/collection.js'

export class CMS {
    page = { data: {}, meta: {} }
    classes = {}
    cmsCollection
    hash = ''
    webcomponents = {}
    components = {}
    static cms
    constructor() {
        this.initPage()
        this.cmsCollection = new Collection('cms')
        CMS.cms = this
    }

    initPage() {
        let pageMetaElements = document.getElementsByTagName('meta')
        for (let i = 0; i < pageMetaElements.length; i++) {
            this.page.meta[pageMetaElements[i].name] = pageMetaElements[i].content
        }

        this.page.title = document.title
        this.page.url = window.location.href
        this.page.path = window.location.pathname
        this.id = this.page.meta.id

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
    // distinction between webcomponents and components
    async initComponents() {

        let data = await this.cmsCollection.getByName(this.page.meta.id)
        if (data && Object.keys(data).length > 0 && data.constructor === Object) this.page.data = data

        //get all the elements with the cms class to create objects
        this.page.elements = document.getElementsByClassName('cms')
        this.page.componentObject = {}

        await this.initializeComponents(this.page.elements)

        this.setHash()
        this.isEdit()
        this.loadComponentsFromCMS()

        //change body visibility to visible
        document.body.style.visibility = 'visible'
    }
    async initializeComponents(elements) {
        //for each element load modules TODO allow components to initialize themselves
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            let id = element.id
            let modules = element.getAttribute('data-modules')

            if (modules && this.components[modules] === undefined) {
                this.components[modules] = await import(`/ai/cms/${modules}/${modules}.js`)
            }

            if (this.components[modules]) {
                this.classes[modules] = this.components[modules][modules]
                this.page.componentObject[id] = new this.classes[modules](element, this)
            } else {
                //TODO don't do this for webcomponents
                if (this.page.data[element.id])
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
            //if modules does not have a dash return
            if (modules.indexOf('-') === -1) continue
            modules = modules.replace(/-/g, '')
            if (modules && this.webcomponents[modules] === undefined) {
                try {
                    this.webcomponents[modules] = await import(`/ai/component/${modules}/${modules}.js`)
                } catch (e) {
                    console.log(e)
                }
            }

        }
    }
    async stringToElement(html) {
        let template = document.createElement('template');
        template.innerHTML = html;
        let elements = template.content.querySelectorAll('.cms')
        let cmsCount = (elements.length)
        await this.initializeComponents(elements)
        return template.content;
    }
    async isEdit() {
        if (localStorage.getItem('enableEditor') !== 'true') return
        let e = await this.stringToElement(`<json-editor class="cms"></json-editor>`)
        document.body.append(e)
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

    loadComponentsFromCMS() {
        let value = ''

        if (!this.page.data.html) return
        
        this.page.data.html.forEach(async (item) => {

            let key = Object.keys(item)[0]
            value = item[key]

            let element = document.querySelector(key)
            this.stringToElement(value).then((value) => {
                element.appendChild(value)
            })

        })
    }
}