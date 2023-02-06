import { component } from '/ai/cms/component/component.js'
import { html } from '/ai/cms/promptarea/html.js'
import { Completion } from '/ai/ai/completion.js'
import { upsert } from '/ai/collection/document.js'

export class promptarea extends component {
    characterCount
    maxLength = 1000
    mediaType
    persona
    htmls = {}
    completion
    constructor(element, cms) {
        super(element, cms)
        this.element.innerHTML = html
        let clipboard = document.getElementById("clipboard")
        this.completion = new Completion()

        this.cms.page.componentObject.media.addCallback(result => {
            let key = result.key
            let value = result.value
            value = JSON.parse(value)
            this.setMediaType(value)
        })


        cms.page.componentObject.persona.addCallback(result => {
            let key = result.key
            let value = result.value
            value = JSON.parse(value)
            this.persona = value
        })

        clipboard.addEventListener("keydown", function () {
            this.characterCount = document.getElementById("clipboard").value.length + 1;
            document.getElementById("wordcount").innerHTML = this.characterCount + `/${this.maxLength} characters`;
        })

        let copyButton = document.getElementById('copy')
        copyButton.addEventListener('click', this.copy.bind(this))

    }
    
    eventListener(e) {
        if (e.detail.id == 'submit') {
            this.submit()
        }
    }
    submit() {

        let prompt = clipboard.value
        let size = this.mediaType.tokens
        if (size < 500) {
            this.cms.page.componentObject.summary.submit(prompt, size)
        }
        else {
            try {
                this.outline = JSON.parse(prompt)
            } catch (e) {
                this.outline = undefined
            }

            if (!this.outline) {
                this.completion.getOutline(prompt).then(out => {
                    console.log(out)
                    clipboard.value = out
                    this.outline = out
                })
            } else {
                this.completion.getCompletionsForArray(this.outline.Article.Body).then(results => {
                    return results.sort((a, b) => (a.count > b.count) ? 1 : -1)
                }).then(results => {
                    let summary = ''
                    results.forEach(result => {
                        summary += result.text
                    })
                    this.cms.page.componentObject.summary.setSummary(summary)
                    window.location.hash = '#Completion'
                })
            }
        }
    }
    setMediaType(mediaType) {
        this.mediaType = mediaType

        this.maxLength = Number(this.mediaType.tokens)
        this.getHTML(this.mediaType).then(tokens => {
            this.element.innerHTML = tokens.html
        })
    }
    async getHTML(data) {
        if (!data) return
        let tokens = data.tokens
        let htmlData = await import(`/ai/cms/promptarea/w${tokens}.js`)
        this.htmls['w' + tokens] = htmlData
        return htmlData
    }
    copy() {
        let persona = this.persona
        let clipboard = document.getElementById('clipboard')
        let summary = document.getElementById('gptSummary').value
        navigator.clipboard.writeText(summary)
        let obj = {
            name: persona.name,
            history: {
                name: persona.name,
                persona: persona,
                media: this.mediaType,
                prompt: clipboard.value,
                date: new Date().toISOString(),
                summary: summary
            }
        }
        upsert('history', 'history', obj).then(out =>
            console.log('upserted', out))
    }

}