import { component } from '/ai/cms/component/component.js'
import { html } from '/ai/cms/navbar/html.js'

export class navbar extends component {
    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.element.innerHTML = html
    }
}