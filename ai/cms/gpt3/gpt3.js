import { component } from '/ai/cms/component/component.js'
import { Completion } from '/ai/ai/completion.js'

const html =`
<textarea id="gptSummary" class="paper" style="
height: 100%;
overflow: scroll;
padding: 20px;
width: 100%;
"></textarea>
`
export class gpt3 extends component {
    completion
    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.element.innerHTML = html
        this.firstChild = this.element.firstChild
        this.completion = new Completion()
        this.setCallback(callback)
    }
    callback(data) {
        super.callback(data)
    }
    setCallback(callback) {
        this.completion.addCallback( (data) => {
            //get element by id = summary and append the text
            if (data.finish_reason) {
                console.log(data.finish_reason)
                this.triggerEvent('PROGRESS_EVENT', false) 
                window.location.hash = '#Completion'
                if (callback) callback(data.finish_reason)
            }
            document.getElementById('gptSummary').value += data.text
            if (callback) callback(data)
        })
    }
    setSummary(summary) {
        document.getElementById('gptSummary').value = summary
    }
    submit(prompt, size) {
        this.triggerEvent('PROGRESS_EVENT', true)
        this.completion.get(prompt, size)
    }
}