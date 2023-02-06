export const html =`
<textarea id="clipboard" maxlength="4000" class="paper">
write about <Title> in following format 
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