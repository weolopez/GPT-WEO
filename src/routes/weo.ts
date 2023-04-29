import express from "express";
import { get, post, put, remove, getDocument, upsert } from '../models/obj';
import { getCompletion, createEmbedding, createChat } from "../models/ai";

const router = express.Router();

router.get('/', async function (req, res, next) {

  const text = req.query.text;
  const completion = await createEmbedding(text)
  // const completion = await getCompletion(text)
  res.send(completion);

})

router.post('/', async function (req, res, next) {
  const config = req.body.config
  let from = config.from

  if (!from) from = 'anonymous'
  delete config.from

  const text = req.query.text;

  const defaultJSON: any = await createChat(text)

  // const defaultJSON: any = await getCompletion(text)
  // defaultJSON.history.from = from
  // defaultJSON.name = from

  // upsert('histories', 'history', defaultJSON).then((result: any) => {
  //   console.log('SAVED HISTORY: ')// , result)
  // }).catch((err: any) => {
  //   console.log('ERROR SAVING HISTORY: ', err)
  // })

  res.send(defaultJSON);

});

export default router;