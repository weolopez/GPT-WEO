
export class Component {
    page={}
    constructor() {
        this.initPage()
        document.body.style.visibility = 'visible'
    }

    async initPage() {
        //update page with data from page all meta tags
        let pageMetaElements = document.getElementsByTagName('meta')
        this.page.meta = {}
        for (let i = 0; i < pageMetaElements.length; i++) {
            this.page.meta[pageMetaElements[i].name] = pageMetaElements[i].content
        }
        this.page.title = document.title
        this.page.url = window.location.href
        this.page.path = window.location.pathname
        this.id = this.page.meta.id

        //get all the elements with the cms class
        this.page.elements = document.getElementsByClassName('component')
        this.page.componentObject = {}

        for (let i = 0; i < this.page.elements.length; i++) {
            let element = this.page.elements[i]
            let id = element.id
            let modules = element.getAttribute('data-module')
            let components = {}
            if (modules && components[modules] === undefined) {
                components[modules] = await import(`/component/${modules}/${modules}.js`)
            }
            if (components[modules]) {
                // this.classes[modules] = components[modules][modules]
                this.page.componentObject[id] = new components[modules][modules](element, this)
            }
            if (element.getAttribute('data-for')) {
                document
                    .getElementById(element.getAttribute('data-for'))
                    .appendChild(element)
            }
        }
        this.isEdit()
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

}