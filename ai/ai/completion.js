import { getCompletionConfig } from './aiModels.js'

let outlineTemplate = ` create an outline using the following json format 
{
    "Article": {
        "Title": "",
        "Word Count": 1500,
        "Body": [
            {"Introduction": {
                "Word Count": <count>,
                "Description": ""
            }},
            {"Chapter <number>": {
                "Word Count": <count>,
                "Description": ""
            }},
            ...
            {"Conclusion": {
                "Word Count": <count>,
                "Description": ""
            }}
        ]
    }
}`

export class Completion {
    eventTarget
    eventStream
    longCompletion = false
    constructor(callback) {
        this.superCallback = callback
        this.eventTarget = new EventTarget()
        this.eventTarget.addEventListener('text_completion', (messageEvent) => {
            this.callback(messageEvent.data[0])
        })
    }
    setCallback(callback) {
        this.superCallback = callback
    }
    callback(data) {
        if (this.longCompletion) this.longCompletionCallback(data)
        else this.superCallback(data)
    }
    getLongCompletion(myPrompt, max_tokens) {
        this.longCompletion = true
        this.getCompletion(myPrompt+outlineTemplate, max_tokens, false)
    }
    longCompletionCallback(data) {
        let outline
        try {
            outline = JSON.parse(data.text)
        } catch (e) {
            console.error(e)
            console.log(data.text)
        } 
        this.longCompletion = false
        outline.Article.Body.forEach( (Body, index) => {
            this.getCompletion('This is part of '+outline.Article.Title+' '+JSON.stringify(Body), 3000, false)
        })
        this.superCallback({text:JSON.stringify(outline,2,2), finish_reason: 'done'})
    }

    getCompletion(myPrompt, max_tokens, isStream = true) {
        if (max_tokens > 3500) {
            this.getLongCompletion(myPrompt, max_tokens)
            return
        }
        max_tokens = max_tokens - myPrompt.length

        const jsonDecoder = this.makeJsonDecoder()
        const eventStream = this.makeWriteableEventStream(this.eventTarget)

        fetch("https://api.openai.com/v1/completions", getCompletionConfig(myPrompt, max_tokens, isStream))
            .then(function (response) {
                if (!response.ok) return
                let res = response.body
                    .pipeThrough(new TextDecoderStream())
                    .pipeThrough(jsonDecoder)
                    .pipeTo(eventStream)
            }).catch(error => {
                this.eventTarget.dispatchEvent(
                    new Event('error', { detail: error }))
            });
    }

    makeJsonDecoder() {
        return new TransformStream({
            start(controller) {
                controller.buf = ''
                controller.pos = 0
            },
            transform(chunk, controller) {
                //split chunk into lines
                let lines = chunk.split('\n')
                //loop through lines
                for (let i = 0; i < lines.length; i++) {
                    //if line is not empty
                    if (lines[i] !== '') {
                        if (lines[i] === 'data: [DONE]') {
                            controller.terminate()
                            return
                        }
                        //parse line as JSON
                        let jline;
                        try {
                            jline = JSON.parse(lines[i].substring(5))
                        } catch (e) {
                            try {
                                jline = JSON.parse(lines[i])
                            } catch (e) {
                                console.error(lines[i])// error in the above string (in this case, yes)!
                            }
                        }
                        //enqueue parsed line
                        controller.enqueue(jline)
                    }
                }
            }
        })
    }
    makeWriteableEventStream(eventTarget) {
        return new WritableStream({
            start(controller) {
                eventTarget.dispatchEvent(new Event('start'))
            },
            write(message, controller) {
                if (!message) {
                    console.log('message is null')
                }
                eventTarget.dispatchEvent(
                    new MessageEvent(
                        message.object,
                        { data: message.choices }
                    )
                )
            },
            close(controller) {
                eventTarget.dispatchEvent(new Event('close'))
            },
            abort(reason) {
                eventTarget.dispatchEvent(new Event('abort', { reason }))
            }
        })
    }
}