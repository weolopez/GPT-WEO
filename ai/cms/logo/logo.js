import { component } from '/ai/cms/component/component.js'
import { html } from '/ai/cms/logo/html.js'

export class logo extends component {
    constructor(element, cms) {
        super(element, cms)
        this.element.innerHTML = html

        // on click event callback
    }
    addCallback(callback) {
        this.callback = callback
        this.element.addEventListener('click', this.callback)
    }
}