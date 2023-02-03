import { getCompletionConfig } from './aiModels.js'

let outlineTemplate = ` create an outline using the following json format 
{
    "Article": {
        "Title": "#{prompt}",
        "Word Count": 1500,
        "Body": [
            {"Introduction": {
                "Minimum Word Count": <count>,
                "Details to be used who what when where": ""
            }},
            {"Chapter <number>": {
                "Minimum Word Count": <count>,
                "Description": ""
            }},
            ...
            {"Conclusion": {
                "Minimum Word Count": <count>,
                "Description": ""
            }}
        ]
    }
}`

export class Completion {
    eventTarget
    eventStream
    longCompletion = false
    callbacks = []
    constructor(callback) {
        this.addCallback(callback)
        this.eventTarget = new EventTarget()
        this.eventTarget.addEventListener('text_completion', (messageEvent) => {
            this.callback(messageEvent.data[0])
        })
    }
    addCallback(callback) {
        if (callback) this.callbacks.push(callback)
    }
    callback(data) {
        if (this.longCompletion) this.longCompletionCallback(data)
        else {
            this.callbacks.forEach(callback => {
                callback(data)
            })
        }
    }
    getLongCompletion(prompt, max_tokens) {
        this.longCompletion = true
        //apply prompt to outlineTemplate
        outlineTemplate = outlineTemplate.replace('#{prompt}', prompt)
        this.getCompletion(' Descriptions should be no less than 25 words, introductions should be 100 words '+outlineTemplate, max_tokens, false)
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
        let introduction = ''
        outline.Article.Body.forEach( (Body, index) => {
            if (index === 0) {
                introduction = Body.Introduction.Description + ' '
                this.getCompletion('This is the introduction to '+outline.Article.Title+' '+JSON.stringify(Body), 4000, false)
            }

            else
            this.getCompletion('This is part of '+outline.Article.Title+' the introduction was '+introduction+JSON.stringify(Body), 4000, false)
        })

        this.callbacks.forEach(callback => {
            callback({text:JSON.stringify(outline,2,2), finish_reason: 'done'})
        })
    }

    get(myPrompt, max_tokens) {
        if (max_tokens > 350) {
            this.getLongCompletion(myPrompt, 4000)
            return
        } else {
            this.getCompletion(myPrompt, max_tokens)
        }
    }


    getCompletion(myPrompt, max_tokens, isStream = true) {
        max_tokens = max_tokens - (myPrompt.length/4)
        //convert max_tokens from float to integer
        max_tokens = Math.floor(max_tokens)

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