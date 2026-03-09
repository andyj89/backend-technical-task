import { ProductsRepository } from '../repositories/productRepository.js';
import { ProductsClient } from '../clients/productsClient.js';
import {
  NormalisedProduct,
  RawProduct,
  StoreProduct,
  ValidatedQuery,
} from '../types.js';
import {
  extractAgeData,
  extractPrice,
  extractStock,
} from './productNormaliser.js';

export type ProductsService = {
  ingestProducts: (
    pathOrUrl: string,
  ) => Promise<{ inserted: number; failed: string[] }>;
  findByAge: (age: number) => Promise<StoreProduct[]>;
  findProducts: (filters: ValidatedQuery) => Promise<StoreProduct[]>;
};

export const createProductsService = (
  repository: ProductsRepository,
  client: ProductsClient,
): ProductsService => {
  const ingestProducts = async (pathOrUrl: string) => {
    const data = await client.fetchProducts(pathOrUrl);
    const valid: NormalisedProduct[] = [];
    const failed: string[] = [];

    for (const rawProduct of data.products) {
      const normalised = normaliseProduct(rawProduct);
      if (normalised) {
        valid.push(normalised);
      } else {
        failed.push(rawProduct.uuid);
      }
    }

    const inserted = repository.insertProducts(valid);

    if (failed.length > 0) {
      console.warn(`Failed to import ${failed.length} products:`, failed);
    }

    return { inserted, failed };
  };

  const normaliseProduct = (
    rawProduct: RawProduct,
  ): NormalisedProduct | null => {
    const ageData = extractAgeData(rawProduct);
    const priceData = extractPrice(rawProduct);
    const stockData = extractStock(rawProduct);

    if (!ageData || !priceData || !stockData) {
      console.log(`Skipping product`, {
        uuid: rawProduct.uuid,
        hasAge: !!ageData,
        hasPrice: !!priceData,
        hasStock: !!stockData,
      });
      return null;
    }

    return {
      uuid: rawProduct.uuid,
      handle: rawProduct.handle,
      description: rawProduct.description,
      store: rawProduct.store,
      title: rawProduct.title,
      type: rawProduct.type,
      minAge: ageData.minAge,
      maxAge: ageData.maxAge,
      price: priceData.price,
      currency: priceData.currency,
      inStock: stockData.inStock,
      stockLevel: stockData.stockLevel,
    };
  };

  const findByAge = async (age: number): Promise<StoreProduct[]> => {
    return repository.findByAge(age);
  };

  const findProducts = async (
    filters: ValidatedQuery,
  ): Promise<StoreProduct[]> => {
    return repository.findProducts(filters);
  };

  return {
    ingestProducts,
    findByAge,
    findProducts,
  };
};
