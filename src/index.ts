import 'source-map-support/register';
import 'reflect-metadata';

import { createConnection } from 'typeorm';

import app, { apolloServer } from './app';

const PORT = 8888;

(async () => {
  try {
    console.log('start establishing database connection...');
    await createConnection();
    console.log('database connected.');
    app.listen(PORT, () => {
      console.log(`listening on localhost:${PORT}...`);
      console.log(`graphql path:${PORT}${apolloServer.graphqlPath}...`);
    });
  } catch (e) {
    console.log(e);
  }
})();
