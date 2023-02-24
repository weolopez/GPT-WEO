import { Configuration, OpenAIApi } from "openai";

const config= {
    model: "text-davinci-003",
    prompt: 'This is a test prompt',
    temperature: 0.3,
    max_tokens: 2000,
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });

  const openai = new OpenAIApi(configuration);

  export async function getCompletion(prompt: any, config?: any) {
    // config.prompt = prompt
    // console.log(`\n\n#####config##${prompt}##\n\n\n`)
    // console.dir(config)
    // console.log('\n\n#####config####\n\n\n')
    return await openai.createCompletion(config).then((completion: { data: any; }) => {
        const defaultJSON = {
            history: {
              completion: completion.data,
              config
            }
          }
          // console.log('\n\n#####defaultJSON####\n\n\n')
          // console.dir(defaultJSON)
          // console.log('\n\n#####defaultJSON####\n\n\n')

        return defaultJSON
      }).catch((err: any) => {
        console.log(err);
      })
    }