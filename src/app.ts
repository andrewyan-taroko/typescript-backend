import { getConnection } from 'typeorm';
import { User } from '../db/entity/User';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

import { add } from './math';

export default express()
  .use(morgan('dev'))
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .get('/', async (req, res) => {
    try {
      const result = await getConnection().manager.find(User);
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  })
  .get('/err', (req, res) => {
    try {
      throw new Error('weee i am a bug!');
    } catch (e) {
      console.trace(e);
      res.end('meow!!!');
    }
  })
  .get('/debug', (req, res) => {
    const sum = add(1, 2);
    res.end(`the sum is ${sum}`);
  });
