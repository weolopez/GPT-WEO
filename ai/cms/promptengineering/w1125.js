export const html =`
<textarea id="clipboard" maxlength="4000" class="paper">
write a 1500 word article outline about <prompt> in following json format 
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
} </textarea>
<div class="marginRight" style="display: flex; justify-content: space-between;">
    <div id="wordcount">0/1000</div>
</div>
`