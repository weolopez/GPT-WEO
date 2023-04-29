import { Configuration, OpenAIApi } from "openai";



  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });

  const openai = new OpenAIApi(configuration);

  export async function getCompletion(prompt: any) {
    const config= {
      model: "text-davinci-003",
      prompt,
      temperature: 0.3,
      max_tokens: 2000,
    }
    return await openai.createCompletion(config).then((completion: { data: any; }) => {
        const defaultJSON = {
            history: {
              completion: completion.data,
              config
            }
          }
        return defaultJSON
      }).catch((err: any) => {
        console.log(err);
      })
    }

  export async function createEmbedding(prompt: any, config?: any) {
    return await openai.createEmbedding({
      input: prompt,
      model: 'text-embedding-ada-002'
    }).then((completion: { data: any; }) => {
     return completion.data.data[0].embedding
    })
      .catch((err: any) => {
        if (err.response.status !== 200) {
          console.log(err.response);
        }
      })
    }

    // this function is to create a chat-gpt interface
 export async function createChat(params:any, config?: any) {
  console.log(params)
  return await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{role: "user", content: params}],
  }).then((completion: { data: any; }) => {
    console.log(completion.data)
      const defaultJSON = {
          history: {
            completion: completion.data.choices[0],
            config
          }
        }
      return defaultJSON
    }).catch((err: any) => {
      console.log(err);
    })
  }