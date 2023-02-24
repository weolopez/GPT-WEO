import { PineconeClient } from "@pinecone-database/pinecone";

import type {
    PineconeClient as PineconeClientGeneric,
    Vector
  } from '@pinecone-database/pinecone'
// import * as types from '@/server/types'

const pinecone = new PineconeClient();
const key = (process.env.PINECONE_API_KEY) ? process.env.PINECONE_API_KEY : 'PINECONE_API_KEY'
pinecone.init({
    environment: "YOUR_ENVIRONMENT",
    apiKey: key
  })

// create an async functiont to upsert text by first creating an embedding
// then upserting the embedding into pinecone
// async function upsertText(text: string, id: string) {
//     const { data: embed } = await openai.createEmbedding({
//         input: text,
//         model: config.openaiEmbeddingModel
//         })
//     const res = await pinecone.upsert({
//         id: id,
//         vector: embed.data[0].embedding,
//         metadata: { text }
//     })
// }


// const pinecone = new PineconeClient<any>({
//     apiKey: process.env.PINECONE_API_KEY,
//     baseUrl: process.env.PINECONE_BASE_URL,
//     namespace: process.env.PINECONE_NAMESPACE
//   })
