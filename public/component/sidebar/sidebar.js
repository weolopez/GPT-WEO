import { Component } from '../componentInterface.js'
import { html } from './html.js'

export class sidebar extends Component {
    currentTabID

    constructor(element, cms, callback) {
        super(element, cms, callback)
        //append html to element after last child
        var div = document.createElement('div')
        div.innerHTML = html
        this.element.appendChild(div)
    }
}