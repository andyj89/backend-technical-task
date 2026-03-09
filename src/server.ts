import express from 'express';
import cors from 'cors';
import { DatabaseSync } from 'node:sqlite';
import { ProductsRepository } from './repositories/productsRepository';
import { createProductsClient } from './clients/productsClient';
import { createProductsService } from './services/prodctsService';
import { createProductsRouter } from './productsApi';

// Create shared database and service
const dbPath = process.env.DB_PATH || './products.db';
const db = new DatabaseSync(dbPath);
const repository = new ProductsRepository(db);
const client = createProductsClient();
const productsService = createProductsService(repository, client);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ message: 'ok' });
});

app.use('/api', createProductsRouter(productsService));

export { app, productsService };
