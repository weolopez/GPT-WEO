import { component } from '/ai/cms/component/component.js'
import { html } from '/ai/cms/tabs/html.js'

export class tabs extends component {
    currentTabID

    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.init()
    }
    setTab(hash) {
        this.setHash(hash)
    }

    setHash(hash) {
        if (!hash) hash = this.element.getAttribute('name')
        super.setHash(hash)

        this.currentTabID = hash

        //for children of ul find a with href = "#id" and set class to active
        var children = this.element.children[0].children
        for (var i = 0; i < children.length; i++) {
            let currentTab = children[i].children[0].href.split('#')[1]

            if (currentTab === hash) {
                children[i].children[0].className = 'nav-link active'
            } else {
                children[i].children[0].className = 'nav-link'
            }
        }

        //for children of element find child with id = id and set style to display: block
        var children = this.element.children
        for (var i = 1; i < children.length; i++) {
            let tabConente = children[i].getAttribute('name')
            tabConente = tabConente.replace(/ /g, '_')
            if ( tabConente == hash) {
                children[i].style.display = 'block'
            } else {
                children[i].style.display = 'none'
            }
        }
        if (this.callback) this.callback(hash)
    }
    init() {
        var children = this.element.children

        var ul = document.createElement('ul')
        ul.className = 'nav nav-tabs'

        for (var i = 0; i < children.length; i++) {
            let name = children[i].getAttribute('name')
            name = name.replace(/ /g, '_')

            var li = document.createElement('li')
            li.className = 'nav-item'

            var a = document.createElement('a')
            a.className = 'nav-link'
            a.href = '#' + name
            a.innerHTML = children[i].getAttribute('name')

            li.appendChild(a)
            ul.appendChild(li)
        }
        this.element.insertBefore(ul, this.element.firstChild)

    }

}