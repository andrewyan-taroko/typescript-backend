import {
  ApolloServer,
  gql,
  UserInputError,
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
    getUser(id: ID!): User
    getUsers: [User]!

    getPost(id: ID!): Post
    getPosts: [Post]!

    getComment(id: ID!): Comment
    getComments: [Comment]!
  }

  type Mutation {
    addUser(input: UserInput): User
    updateUser(id: ID, input: UserInput): User
    deleteUser(id: ID): User

    addPost(input: PostInput): Post
    updatePost(id: ID, input: PostInput): Post
    deletePost(id: ID): Post
  }

  input UserInput {
    email: String
    password: String
  }

  input PostInput {
    userId: ID
    title: String
    content: String
  }

  input CommentInput {
    userId: ID
    postId: ID
    parentId: ID
    content: String
  }

  type User {
    id: ID!
    email: String!
    posts: [Post]
    comments: [Comment]
  }

  type Post {
    id: ID!
    title: String
    content: String
    user: User
    comments: [Comment]
  }

  type Comment {
    id: ID!
    content: String
    user: User
    post: Post
    parent: Comment
    children: [Comment]
  }
`;

const resolvers = {
  Query: {
    getUser: async (parent : any, { id }: { id: string }) => {
      const result = await getManager().findOne(User, { relations: ['posts', 'comments'], where: { id } });
      return result ? {
        id:       result.id,
        email:    result.email,
        posts:    result.posts,
        comments: result.comments,
      } : null;
    },
    getUsers: async (parent: any, args: any) => {
      return await getManager().find(User, { relations: ['posts', 'comments'] });
    },
    getPost: async (parent: any, { id }: { id: string }) => {
      const result = await getManager().findOne(Post, { relations: ['user', 'comments'], where: { id } });
      return result ? {
        id:      result.id,
        title:   result.title,
        content: result.content,
      } : null;
    },
    getPosts: async (parent: any, args: any) => {
      return await getManager().find(Post, { relations: ['user', 'comments'] });
    },
    getComment: async (parent: any, { id }: { id: string }) => {
      const result = await getManager().findOne(Comment, { relations: ['user', 'post', 'parent', 'children'], where: { id } });
      return result ? {
        id:       result.id,
        content:  result.content,
        user:     result.user,
        post:     result.post,
        parent:   result.parent,
        children: result.children,
      } : null;
    },
    getComments: async (parent: any, args: any) => {
      return await getManager().find(Comment, { relations: ['user', 'post', 'parent', 'children'] });
    },
  },
  Mutation: {
    addUser: async (parent: any, { input }: { input: { email: string, password: string } }) => {
      const user    = new User();
      user.email    = input.email;
      user.password = input.password;
      await getManager().save(user);
      return user;
    },
    updateUser: async (parent: any, { id, input }: { id: string, input: { email: string, password: string }}) => {
      const user = await getManager().findOne(User, { relations: ['posts', 'comments'], where: { id } });
      if (user) {
        user.email    = input.email || user.email;
        user.password = input.password || user.password;
        await getManager().save(user);
      }
      return user;
    },
    deleteUser: async (parent: any, { id }: { id: string }) => {
      const user = await getManager().findOne(User, { relations: ['posts', 'comments'], where: { id } });
      await getManager().delete(User, id);
      return user;
    },
    addPost: async (parent: any, { input }: { input: { userId: string, title: string, content: string }}) => {
      const user = await getManager().findOne(User, { where: { id: input.userId }});
      if (user) {
        const post   = new Post();
        post.title   = input.title;
        post.content = input.content;
        post.user    = user;
        await getManager().save(post);
        return post;
      } else {
        throw new UserInputError('user not found');
      }
    },
    updatePost: async (parent: any, { id, input }: { id: string, input: { title: string, content: string } }) => {
      const post = await getManager().findOne(Post, { relations: ['user', 'comments'], where: { id } });
      if (post) {
        post.title = input.title || post.title;
        post.content = input.content || post.content;
        await getManager().save(post);
      }
      return post;
    },
    deletePost: async (parent: any, { id }: { id: string }) => {
      const post = await getManager().findOne(Post, id, { relations: ['user', 'comments'], where: { id } });
      await getManager().delete(Post, id);
      return post;
    }
  }
};

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // debug: false
});

apolloServer.applyMiddleware({ app });

export default app;
