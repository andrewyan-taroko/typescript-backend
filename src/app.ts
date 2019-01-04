import express from 'express';
import morgan from 'morgan';

import { add } from './math';

export default express()
  .use(morgan('dev'))
  .get('/', (req, res) => {
    res.end('hello world');
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
