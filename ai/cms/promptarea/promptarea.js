import { component } from '/ai/cms/component/component.js'
import { html } from '/ai/cms/promptarea/html.js'
import { Completion } from '/ai/ai/completion.js'

export class promptarea extends component {
    characterCount
    maxLength = 1000
    mediaType
    htmls = {}
    completion
    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.element.innerHTML = html
        let clipboard = document.getElementById("clipboard")
        this.completion = new Completion()

        this.cms.page.componentObject.media.addCallback( result => {
            let key = result.key
            let value = result.value
            value = JSON.parse(value)
            this.setMediaType(value)
        })

        clipboard.addEventListener("keydown", function () {
            this.characterCount = document.getElementById("clipboard").value.length + 1;
            document.getElementById("wordcount").innerHTML = this.characterCount + `/${this.maxLength} characters`;
        })

        //onclick of button with id=submit call submit function
        let submitButton = document.getElementById('submit')
        submitButton.addEventListener('click', this.submit.bind(this))  
        let running = false;
    }
    submit() {
        // if (running) return;
       let running = true;
        //change the location to #summary
        window.location.hash = '#Completion'
        //TODO expose api to clear the summary
        // document.getElementById("summary").value = ''

        let prompt = clipboard.value
        let size = this.mediaType.tokens
        this.completion.getOutline(prompt)
        // this.cms.page.componentObject.summary.submit(prompt, size)

        running = false;
    }
    setMediaType(mediaType) {
        this.mediaType = mediaType

        this.maxLength = Number(this.mediaType.tokens)
        this.getHTML(this.mediaType).then(tokens => {
            this.element.innerHTML = tokens.html
        })

        //    this. = html
    }
    async getHTML(data) {
        if (!data) return
        let tokens = data.tokens
        let htmlData = await import(`/ai/cms/promptarea/w${tokens}.js`)
        this.htmls['w' + tokens] = htmlData
        return htmlData
    }
}