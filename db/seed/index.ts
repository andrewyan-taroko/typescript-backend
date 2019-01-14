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
    user.password = faker.internet.password();
    return user;
  });
  await connection.manager.save(users);
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
