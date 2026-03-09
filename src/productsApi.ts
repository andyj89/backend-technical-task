import { Router } from 'express';
import type { Request, Response } from 'express';
import { validateQuery } from './validators';
import ClientError from './errors/ClientError';
import type { ProductsService } from './services/prodctsService';

export const createProductsRouter = (productsService: ProductsService) => {
  const router = Router();

  router.post('/products/ingest', async (req: Request, res: Response) => {
    try {
      const path = req.body.path;
      const result = await productsService.ingestProducts(path);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  router.get('/products', async (req: Request, res: Response) => {
    try {
      const validatedQuery = validateQuery(req.query);
      const products = await productsService.findProducts(validatedQuery);
      const metaData = {
        count: products.length,
        filters: validatedQuery,
      };
      res.json({ products, metaData });
    } catch (error) {
      res
        .status((error as ClientError).status ?? 500)
        .json({ error: (error as Error).message });
    }
  });

  return router;
};
