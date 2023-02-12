export function getHTML(json) {
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
`}