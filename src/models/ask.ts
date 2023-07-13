
import { getCompletion, createEmbedding } from "./ai";
import { pineconeQuery } from "./pinecone";

async function main() {

  const question = 'how is gravity related to electro magnatism'
  // console.log('question', question)
  // const embed = await createEmbedding(question)
  // console.log(embed)
  // let contexts: any = await pineconeQuery(embed)
  const contexts: any = await pineconeQuery(question)
  console.log(contexts)
  const prompt = getPrompt(contexts, question, 10)
  console.log(prompt)
  // const data: any = await getCompletion(prompt)
  // console.log(data.history.completion.choices[0].text)
}
main().catch((err) => {
  console.error('error', err)
  process.exit(1)
})

function getPrompt(contexts: string[], question: string, limit: number) {

  // build our prompt with the retrieved contexts included
  let prompt: string = "Answer the question based on the context below.\n\nContext:\n";
  const promptend: string = `\n\nQuestion: ${question}\nAnswer:`;

  for (let i = 1; i < contexts.length; i++) {
    prompt += contexts[i]
  }

  return prompt + promptend

}
