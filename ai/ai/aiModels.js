export let getHeaders = () => {
   var openai_key = localStorage.getItem('openai_key')  
   return {
        "Content-Type": "application/json",
        "Accept": "event-stream",
        'Authorization': `Bearer ${openai_key}`
    }
}

export let getCompletionConfig = (myPrompt, max_tokens, isStream) => {
   return {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: myPrompt,
            temperature: 0.5,
            max_tokens: max_tokens,
            n: 1,
            stop: 'none',
            stream: isStream
        })
    }
}