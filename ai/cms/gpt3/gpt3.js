import { Component } from '/ai/cms/component.js'
import { Completion } from '/ai/ai/completion.js'

const html =`
<textarea id="gptSummary" class="paper" style="
height: 100%;
overflow: scroll;
padding: 20px;
width: 100%;
"></textarea>
`
export class gpt3 extends Component {
    completion
    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.element.innerHTML = html
        this.firstChild = this.element.firstChild
        this.completion = new Completion()
        this.setCallback(callback)
    }
    setCallback(callback) {
        this.completion.setCallback( (data) => {
            //get element by id = summary and append the text
            if (data.finish_reason) console.log(data.finish_reason)
            document.getElementById('gptSummary').value += data.text
            if (callback) callback(data)
        })
    }
    submit(prompt, size) {
        this.completion.getCompletion(prompt, size)
    }
}