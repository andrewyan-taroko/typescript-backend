import { getManager } from 'typeorm';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import {
  ApolloServer,
  gql,
  ApolloError,
} from 'apollo-server-express';

import { User } from '../db/entity/User';
import { Post } from '../db/entity/Post';
import { Comment } from '../db/entity/Comment';
import { add } from './math';

const app = express()
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
      const result = await getManager().find(Comment, { relations: ['user', 'post', 'parent', 'children'] });
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

const typeDefs = gql`
  type Query {
    user(id: String): User
    users: [User]
    post(id: String): Post
    posts: [Post]
    comment(id: String): Comment
    comments: [Comment]
  }

  type User {
    id: ID
    email: String
    posts: [Post]
    comments: [Comment]
  }

  type Post {
    id: ID
    title: String
    content: String
    user: User
    comments: [Comment]
  }

  type Comment {
    id: ID
    content: String
    user: User
    post: Post
    parent: Comment
    children: [Comment]
  }
`;

const resolvers = {
  Query: {
    user: async (parent: any, { id }: any) => {
      throw new ApolloError('meow');
      return await getManager().findOne(User, { relations: ['posts','comments'], where: { id } });
      // try {
      // } catch (e) {
      //   console.log(e);
      // }
    },
    users: async () => {
      try {
        return await getManager().find(User, { relations: ['posts','comments'] });
      } catch (e) {
        console.log(e);
      }
    },
    post: async (parent: any, { id }: any) => {
      try {
        return await getManager().findOne(Post, { relations: ['user','comments'], where: { id } });
      } catch (e) {
        console.log(e);
      }
    },
    posts: async () => {
      try {
        return await getManager().find(Post, { relations: ['user','comments'] });
      } catch (e) {
        console.log(e);
      }
    },
    comment: async (parent: any, { id }: any) => {
      try {
        return await getManager().findOne(Comment, { relations: ['user', 'post', 'parent', 'children'], where: { id } });
      } catch (e) {
        console.log(e);
      }
    },
    comments: async () => {
      try {
        return await getManager().find(Comment, { relations: ['user', 'post', 'parent', 'children'] });
      } catch (e) {
        console.log(e);
      }
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({app});

export default app;
