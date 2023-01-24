import { Component } from '/ai/cms/component.js'
import { html } from '/ai/cms/logo/html.js'

export class logo extends Component {
    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.element.innerHTML = html
    }
}