// import { PineconeClient, QueryRequest, UpsertRequest, Vector } from "@pinecone-database/pinecone";
import { getCompletion, createEmbedding } from "./ai";

const env = (process.env.PINECONE_URL) ? process.env.PINECONE_URL : 'weo-memory-9a93337.svc.us-east1-gcp'
const apiKey = (process.env.PINECONE_API_KEY) ? process.env.PINECONE_API_KEY : ''

// const pinecone = new PineconeClient();
// pinecone.init({
//   environment: env,
//   apiKey: apiKey,
// });

// export async function pineconeQuery(embed: string) {
//   const index = pinecone.Index("physics-youtube")
//   let qreq: QueryRequest | any = {};
//   qreq.vector = embed
//   qreq.topK = 10
//   qreq.includeMetadata = true
//   qreq.includeValues = false
//   qreq.namespace = process.env.PINECONE_NAMESPACE
//   const res = await index.query(qreq)
//   return res.data.matches?.map((x: any) => x.metadata.text);
// }
// export async function pineconeUpsert() { //id: string, metadata: object, embed: Array<number>) {
//   const index = pinecone.Index("physics-youtube")

//   const vector1 = {
//     id: 'vec1',
//     values: [0.1, 0.2, 0.3, 0.4],
//     metadata: { 'genre': 'drama' }
//   }
//   const vector2 = {
//     id: 'vec2',
//     values: [0.2, 0.3, 0.4, 0.5],
//     metadata: { 'genre': 'action' }
//   }

//   const upsertrequest = {
//     vectors: [vector1, vector2]
//   };

//   await index.upsert(upsertrequest);

// }
export async function pineconeUpsert(text: string, context: any) {
  const embed = await createEmbedding(text)
  return await upsert(embed, context)
}

async function upsert(embed: any, context: any) {
  const url = `https://${env}.pinecone.io/upsert`
  const headers = {
    'Api-Key': apiKey,
    'accept': 'application/json',
    'content-type': 'application/json'
  }
  const body = {
    "namespace": process.env.PINECONE_NAMESPACE,
    "vectors": [ {
      "id": "A",
      "values": embed,
      "metadata": {
          "fname": "mauricio",
          "lname": "lopez"
      }
    }
  ]}
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  console.log('res', res)
  // const data = await res.json()
  return res
//   --data '
// {
//   "vectors": [
//        {
//             "id": "example-vector-1",
//             "values": [
//                  0.1,
//                  0.2,
//                  0.3,
//                  0.4,
//                  0.5,
//                  0.6,
//                  0.7,
//                  0.8
//             ],
//             "sparseValues": {
//                  "indices": [
//                       1,
//                       312,
//                       822,
//                       14,
//                       980
//                  ],
//                  "values": [
//                       0.1,
//                       0.2,
//                       0.3,
//                       0.4,
//                       0.5
//                  ]
//             },
//             "metadata": {
//                  "genre": "documentary",
//                  "year": 2019
//             }
//        }
//   ],
//   "namespace": "example-namespace"
// }


}

export async function pineconeQuery(text: string) {
  // const embed = await createEmbedding(text)
  // console.log('embed', embed)
  // const result = await query(embed)
  // console.log('result', result)
  return await query(await createEmbedding(text))
}

async function query(embed: any) {
  const url = `https://${env}.pinecone.io/query`
  const headers = {
    'Api-Key': apiKey,
    'accept': 'application/json',
    'content-type': 'application/json'
  }
  const body = {
    "includeValues": "true",
    "includeMetadata": "true",
    "topK": 1,
    "namespace": process.env.PINECONE_NAMESPACE,
    "vector": embed
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  const data = await res.json()
  return data

  // return data.matches?.map((x: any) => x.metadata.text);
}
