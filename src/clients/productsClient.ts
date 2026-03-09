import { RawProduct } from '../types.js';
import { readFile } from 'node:fs/promises';

export type ProductsClient = {
  fetchProducts: (pathOrUrl: string) => Promise<{ products: RawProduct[] }>;
};

export const createProductsClient = (): ProductsClient => ({
  fetchProducts: async (pathOrUrl: string) => {
    const data = await readFile(pathOrUrl, 'utf-8');
    return JSON.parse(data);
  },
});
