import express from "express";
import { model } from "mongoose";
import { get, post, put, remove, getDocument, upsert } from '../models/obj';
import { getCompletion } from "../models/ai";

const router = express.Router();

router.get('/', async function (req, res, next) {

  const text = req.query.text;

  const pineconeAPIKey = process.env.PINECONE_API_KEY

  const completion = await getCompletion(text)// .then((completion: any) => {
  res.send(completion);

})

router.post('/', async function (req, res, next) {
  const config = req.body.config
  let from = config.from

  if (!from) from = 'anonymous'
  delete config.from

  const text = req.query.text;

  // console.dir('config: ', config)
  const defaultJSON: any = await getCompletion(text, config) // .then((defaultJSON: any) => {
  defaultJSON.history.from = from
  defaultJSON.name = from

  upsert('histories', 'history', defaultJSON).then((result: any) => {
    console.log('SAVED HISTORY: ', result)
  }).catch((err: any) => {
    console.log('ERROR SAVING HISTORY: ', err)
  })

  res.send(defaultJSON);

});

export default router;