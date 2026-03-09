import { ProductsRepository } from '../repositories/productsRepository.js';
import { ProductsClient } from '../clients/productsClient.js';
import { NormalisedProduct, RawProduct, StoreProduct } from '../types.js';
import {
  extractAgeData,
  extractPrice,
  extractStock,
} from './productsNormaliser.js';

export type ProductsService = {
  ingestProducts: (
    pathOrUrl: string,
  ) => Promise<{ inserted: number; failed: string[] }>;
  findByAge: (age: number) => Promise<StoreProduct[]>;
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
    return { inserted, failed };
  };

  const normaliseProduct = (
    rawProduct: RawProduct,
  ): NormalisedProduct | null => {
    const ageData = extractAgeData(rawProduct);
    const priceData = extractPrice(rawProduct);
    const stockData = extractStock(rawProduct);

    if (!priceData || !stockData) {
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
      inStock: stockData?.inStock ?? false,
      stockLevel: stockData?.stockLevel ?? 0,
    };
  };

  const findByAge = async (age: number): Promise<StoreProduct[]> => {
    return repository.findByAge(age);
  };

  return {
    ingestProducts,
    findByAge,
  };
};
