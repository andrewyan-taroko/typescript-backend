import 'source-map-support/register';
import 'reflect-metadata';

import { createConnection } from 'typeorm';

import app from './app';

const PORT = 8888;

(async () => {
  try {
    console.log('start establishing database connection...');
    await createConnection();
    console.log('database connected.');
    app.listen(PORT, () => {
      console.log(`listening on localhost:${PORT}...`);
    });
  } catch (e) {
    console.log(e);
  }
})();
