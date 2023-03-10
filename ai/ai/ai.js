import { getCompletionConfig } from './aiModels.js'

function makeJsonDecoder() {
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
                    } catch(e) {
                        console.error(lines)// error in the above string (in this case, yes)!
                    }
                    //enqueue parsed line
                    controller.enqueue(jline)
                }
            }
        }
    })
}
function makeWriteableEventStream(eventTarget) {
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
export async function getCompletion(myPrompt, max_tokens, callback) {
    if (max_tokens < 300) {
        getPartialCompletion(myPrompt, max_tokens, callback)
    } else {
        let outlinePrompt = `create an outline for  ${myPrompt}.  The outline should be in the following json format:  { "title": "Winterizing Your Home", "wordCount": "4000", "outline": [ { "sectionTitle": "Introduction", "wordCount": "200" }, { "sectionTitle": "Checking the Roof", "wordCount": "500" }, { "sectionTitle": "Sealing Windows and Doors", "wordCount": "500" }, { "sectionTitle": "Insulating Your Home", "wordCount": "500" }, { "sectionTitle": "Cleaning Gutters and Downspouts", "wordCount": "500" }, { "sectionTitle": "Protecting Outdoor Pipes", "wordCount": "500" }, { "sectionTitle": "Conclusion", "wordCount": "200" } ] } `
        let outline = await getFullCompleteion(outlinePrompt, max_tokens)
        let outlineResult = JSON.parse(outline.data[0].text)
        outlineResult.outline.push('end')
        await outlineResult.outline.forEach(async (section, index) => {
            if (section === 'end') {
                callback(outline)
                return
            }
            let prompt = `${myPrompt} ${section.sectionTitle} `//${outline.sections[index - 1].sectionTitle} ${outline.sections[index + 1].sectionTitle}`
            let partial = await getFullCompleteion(prompt, 2*Number(section.wordCount))
            partial.data[0].finish_reason === 'go'
            // console.log('partial', partial)
            callback(partial)
        })
        // console.log('outline', outline)
        // callback(outline)
    }
}

function getFullCompleteion(myPrompt, max_tokens) {
    return new Promise((resolve, reject) => {
        let returnString = ''
        getPartialCompletion(myPrompt, max_tokens, (event) => {
            if (event.data[0].finish_reason === 'stop') {
                event.data[0].text = returnString
                resolve(event)
            } else returnString += event.data[0].text
        }) 
    })
}

// function getFullCompleteion(myPrompt, max_tokens) {
//     return new Promise((resolve, reject) => {
//         let returnString = ''
//         getPartialCompletion(myPrompt, max_tokens, (event) => {
//             if (event.data[0].finish_reason === 'stop') {
//                 resolve(returnString)
//             } else returnString += event.data[0].text
//         }) 
//     })
// }

function getPartialCompletion(myPrompt, max_tokens, callback) {
    max_tokens = max_tokens - myPrompt.length

    const eventTarget = new EventTarget()
    const jsonDecoder = makeJsonDecoder()
    const eventStream = makeWriteableEventStream(eventTarget)

    eventTarget.addEventListener('text_completion', callback)
    
    fetch("https://api.openai.com/v1/completions", getCompletionConfig(myPrompt, max_tokens) )
        .then(function (response) {
            if (!response.ok) return
            let res = response.body
                .pipeThrough(new TextDecoderStream())
                .pipeThrough(jsonDecoder)
                .pipeTo(eventStream)
        }).catch(error => {
            eventTarget.dispatchEvent(
                new Event('error', { detail: error }))
        });
}

// nodejs function for command line interface
function cli() {
    // get all arguments as a string
    const args = process.argv.slice(2).join(' ')
    console.log(args)

    //if argements are passed, use them as prompt
    if (args) {
        getCompletion(args, 2000, (event) => {
            if (event.data[0].finish_reason !== 'stop' )
                process.stdout.write(event.data[0].text)
        })
        return
    } 

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })
    // if key is not set, prompt for key and store in environment variable OPENAI_KEY
    if (!key) {
        // tell the user to set OPENAI_KEY environment variable 
        console.log('Please set OPENAI_KEY environment variable to your OpenAI API key')
    }
    readline.question('Prompt: ', (prompt) => {
        getCompletion(prompt, 2000, (event) => {
            if (event.data[0].finish_reason !== 'stop' ) 
                 process.stdout.write(event.data[0].text)
        })
        readline.close()
    })
}

//if localstorage is available, use it to store key
if (typeof localStorage !== 'undefined')  var openai_key = localStorage.getItem('openai_key') 
else {
    var openai_key = process.env.OPENAI_KEY
    process.env.NODE_NO_WARNINGS = 1
    cli()
}