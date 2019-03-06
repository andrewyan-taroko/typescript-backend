import {
  ApolloServer,
  gql,
} from 'apollo-server-express';
import { getManager } from 'typeorm';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

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
    user(id: ID!): User
    users: [User]!

    post(id: ID!): Post
    posts: [Post]!

    comment(id: ID!): Comment
    comments: [Comment]!
  }

  type User {
    id: ID!
    email: String!
    posts: [Post]!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    title: String
    content: String
  }

  type Comment {
    id: ID!
    content: String
    user: User
    post: Post
    parent: Comment
    children: [Comment]!
  }
`;

const resolvers = {
  Query: {
    user: async (parent : any, { id }: { id: string }) => {
      const result = await getManager().findOne(User, { relations: ['posts', 'comments'], where: { id } });
      if (result) {
        return {
          id:       result.id,
          email:    result.email,
          posts:    result.posts,
          comments: result.comments,
        };
      }
      return null;
    },
    users: async (parent: any, args: any) => {
      return await getManager().find(User, { relations: ['posts', 'comments'] });
    },
    post: async (parent: any, { id }: { id: string }) => {
      const result = await getManager().findOne(Post, { relations: ['user', 'comments'], where: { id } });
      if (result) {
        return {
          id:      result.id,
          title:   result.title,
          content: result.content,
        };
      }
      return null;
    },
    posts: async (parent: any, args: any) => {
      return await getManager().find(Post, { relations: ['user', 'comments'] });
    },
    comment: async (parent: any, { id }: { id: string }) => {
      const result = await getManager().findOne(Comment, { relations: ['user', 'post', 'parent', 'children'], where: { id } });
      if (result) {
        return {
          id:       result.id,
          content:  result.content,
          user:     result.user,
          post:     result.post,
          parent:   result.parent,
          children: result.children,
        };
      }
      return null;
    },
    comments: async (parent: any, args: any) => {
      return await getManager().find(Comment, { relations: ['user', 'post', 'parent', 'children'] });
    },
  }
};

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // debug: false
});

apolloServer.applyMiddleware({ app });

export default app;
