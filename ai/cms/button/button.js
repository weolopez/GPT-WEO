import { component } from '/ai/cms/component/component.js'
import { html } from '/ai/cms/button/html.js'

export class button extends component {
    constructor(element, cms) {
        super(element, cms)
        // this.init()
        this.element.innerHTML += html
        this.element.style.position = 'relative';
        this.element.addEventListener('click', this.triggerEvent.bind(this))

        document.addEventListener('PROGRESS_EVENT', this.progress.bind(this), false);
    }
    triggerEvent() {
        super.triggerEvent('ComponentEvent', this)
    }

    progress(event) {
        let detail = event.detail;
        let count = detail.count;
        let isComplete = detail.isComplete;
        this.prog = this.element.querySelector('.progress');
        this.ct = this.element.querySelector('#count');

        if (!isComplete) {
            this.prog.classList.remove('changewidth');
            this.ct.innerHTML = '';
        } else {
            this.prog.classList.add('changewidth');
            if (count) {
                this.ct.innerHTML = count;
            }
        }

    }
}