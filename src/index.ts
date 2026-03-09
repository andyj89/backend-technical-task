import { app, productsService } from './server.js';
import { resolve } from 'node:path';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  const productsPath = resolve(
    process.cwd(),
    'products_1000_mixed_schema.json',
  );
  console.log('Ingesting products...');
  const result = await productsService.ingestProducts(productsPath);
  console.log(
    `Ingested ${result.inserted} products, ${result.failed.length} failed`,
  );
  if (result.failed.length > 0) {
    console.log('All failed product UUIDs:', result.failed);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
