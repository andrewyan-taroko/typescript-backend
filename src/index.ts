import 'source-map-support/register';
import 'reflect-metadata/register';

import app from './app';

const PORT = 8888;

app.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}...`);
  });
