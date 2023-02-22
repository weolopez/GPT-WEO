export function getHTML(json,counter) {
    let summary = ''
    try {
        summary = JSON.stringify(JSON.parse(json.summary),2,2)
    } catch (e) {
        summary = json.summary
    }
    return `
<h1>${json.name}</h1>
<h2>${json.date}</h2>
<h4>${json.prompt}</h4>
<pre>${summary}</pre>
<button id="delete${counter}" class="deleteHistoryButton" ><i class="fas fa-trash-alt" id="delete5"></i></button>
`}