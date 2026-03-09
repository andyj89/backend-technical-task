import express from 'express';
import cors from 'cors';
import { DatabaseSync } from 'node:sqlite';
import { ProductsRepository } from './repositories/productRepository.js';
import { createProductsClient } from './clients/productsClient.js';
import { createProductsService } from './services/productService.js';
import { createProductsRouter } from './productsApi.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Create shared database and service
const db = new DatabaseSync(':memory:');
const repository = new ProductsRepository(db);
const client = createProductsClient();
const productsService = createProductsService(repository, client);

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ message: 'ok' });
});

app.use('/api', createProductsRouter(productsService));

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

export { app, productsService };
