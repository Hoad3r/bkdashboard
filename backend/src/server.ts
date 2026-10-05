import { createApp } from './app';
import { createContainer } from './bootstrap/container';
import { seed } from './bootstrap/seed';

const port = Number(process.env.PORT ?? 3001);
const container = createContainer();

if (process.env.SEED_DATA !== 'false') {
  await seed(container);
}

createApp(container).listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
