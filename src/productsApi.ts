import { Router } from 'express';
import type { Request, Response } from 'express';
import { validateQuery } from './validators.js';
import ClientError from './errors/ClientError.js';
import type { ProductsService } from './services/productService.js';

export const createProductsRouter = (productsService: ProductsService) => {
  const router = Router();

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
