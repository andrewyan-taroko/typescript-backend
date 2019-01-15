import { createConnection } from 'typeorm';
import faker from 'faker';

import { User } from '../entity/User';
import { Post } from '../entity/Post';
import { Comment } from '../entity/Comment';

faker.seed(1000);

createConnection().then(async (connection) => {
  console.log('clearing...');
  await connection.manager.delete(Comment, {});
  await connection.manager.delete(Post, {});
  await connection.manager.delete(User, {});
  console.log('done clearing.');

  console.log('start seeding...');
  const users: User[] = new Array(10).fill(0).map(() => {
    const user    = new User();
    user.email    = faker.internet.email();
    user.password = faker.internet.password();
    return user;
  });
  await connection.manager.save(users);

  const posts: Post[] = new Array(20).fill(0).map(() => {
    const post   = new Post();
    post.title   = faker.lorem.words();
    post.content = faker.lorem.paragraphs();
    post.user    = users[faker.random.number() % users.length];
    return post;
  });
  await connection.manager.save(posts);

  const comments: Comment[] = new Array(40).fill(0).map(() => {
    const comment   = new Comment();
    comment.content = faker.lorem.paragraphs();
    comment.user    = users[faker.random.number() % users.length];
    comment.post    = posts[faker.random.number() % posts.length];
    return comment;
  });
  await connection.manager.save(comments);

  await new Promise((res) => setTimeout(res, 2000));
  const user: User | undefined = await connection.manager.findOne(User, { email: 'Constantin_Buckridge@yahoo.com' });
  user!.email = 'weee';
  await connection.manager.save(user);
  console.log('done seeding.');

  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(1);
});
