export const html = `
<div id="textCanvas" contenteditable="true" class="paper">
write a 1,500 word article aboutwrite a 2500 word article outline about <prompt> in following json format 
{
    "Article": {
        "Title": "#{prompt}",
        "Word Count": 2500,
        "Body": [
            {"Introduction": {
                "Minimum Word Count": <count>,
                "Details to be used who what when where": ""
            }},

    <div id="contextarea" >
    </div>
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
} 
        joke types and examples
    in a form of a json ouline.
</div>
<div class="marginRight" style="display: flex; justify-content: space-between;">
    <div id="wordcount">0/1000</div>
</div>
<style>
#textCanvas {
    height: 77vh;
    white-space: pre;
    overflow: scroll;
}
#contextarea {
    top: 0;
    position: absolute;
    width: 100%;
    height: 30vh;
    background: grey;
    opacity: 0.5;
    border: 1px lightgray groove;
    padding: 8px;
    cursor: row-resize;
    white-space: pre
}
</style>

`