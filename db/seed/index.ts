import { createConnection } from 'typeorm';
import faker from 'faker';

import { User } from '../entity/User';

faker.seed(1000);

createConnection().then(async (connection) => {
  console.log('clearing...');
  await connection.manager.clear(User);
  console.log('done clearing.');

  console.log('start seeding...');
  const users: User[] = new Array(10).fill(0).map(() => {
    const user: User = new User();
    user.email = faker.internet.email();
    return user;
  });
  await connection.manager.save(users);
  console.log('done seeding.');

  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(1);
});
