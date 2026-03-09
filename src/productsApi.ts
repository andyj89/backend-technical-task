import { Router } from 'express';
import type { Request, Response } from 'express';
import { createProductsService } from './services/prodctsService';
import { ProductsRepository } from './repositories/productsRepository';
import { DatabaseSync } from 'node:sqlite';
import { createProductsClient } from './clients/productsClient';

const router = Router();
const productsDb = new DatabaseSync(':memory:');
const productsRepository = new ProductsRepository(productsDb);
const productsClient = createProductsClient();
const productsService = createProductsService(
  productsRepository,
  productsClient,
);

router.post('/products/ingest', async (req: Request, res: Response) => {
  try {
    const path = req.body.path;
    await productsService.ingestProducts(path);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/products', (req: Request, res: Response) => {
  res.status(200).json({ message: 'ok' });
});

export { router as productsApi };
