
import { getCompletion, createEmbedding } from "./ai";
import { pineconeQuery, pineconeUpsert } from "./pinecone";

async function main() {

  // const question = 'how is gravity related to electro magnatism'
  const question = 'who is weolopez'
  let contexts: any = await pineconeQuery(question)
  console.dir(contexts.matches)
  const answer = "weolopez is a scholar and a gentleman"
  const result: any = await pineconeUpsert(answer, '')


  contexts = await pineconeQuery(question)
  console.dir(contexts.matches)
  // const prompt = getPrompt(contexts, question, 10)
  // console.log(prompt)
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
