import { getManager } from 'typeorm';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

import { User } from '../db/entity/User';
import { Post } from '../db/entity/Post';
import { Comment } from '../db/entity/Comment';
import { add } from './math';

export default express()
  .use(morgan('dev'))
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .get('/users', async (req, res) => {
    try {
      const result = await getManager().find(User, { relations: ['posts','comments'] });
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  })
  .get('/posts', async (req, res) => {
    try {
      const result = await getManager().find(Post, { relations: ['user','comments'] });
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  })
  .get('/comments', async (req, res) => {
    try {
      const result = await getManager().find(Comment, { relations: ['user','post', 'parent', 'children'] });
      res.json(result);
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  })
  .get('/comments/tree', async (req, res) => {
    try {
      const result = await getManager().getTreeRepository(Comment).findTrees();
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
