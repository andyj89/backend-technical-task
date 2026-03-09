import ClientError from './errors/ClientError.js';

export type QueryValue = string | string[] | undefined;

export type ValidatedQuery = {
  age?: number;
  inStock?: boolean;
  q?: string;
};

export const validateAge = (age: QueryValue): number | undefined => {
  if (!age) return undefined;
  const numAge = Number(age);
  if (Number.isNaN(numAge)) {
    throw new ClientError('age is not a valid number', 400);
  }
  return numAge;
};

export const validateText = (text: QueryValue): string | undefined => {
  if (!text) return undefined;
  if (typeof text === 'string' && text.length > 1000) {
    throw new ClientError('query parameter too long', 400);
  }
  return text as string;
};

export const validateInStock = (stock: QueryValue): boolean | undefined => {
  if (!stock) return undefined;
  if (stock !== 'true' && stock !== 'false') {
    throw new ClientError('stock is not a valid boolean', 400);
  }
  return stock === 'true';
};

const validateStore = (store: QueryValue): string | undefined => {
  if (!store) return undefined;
  if (typeof store !== 'string' || store.length > 100) {
    throw new ClientError('store is not a valid string', 400);
  }
  return store;
};

export const validateQuery = (query: Record<string, any>): ValidatedQuery => {
  const validatedQuery = {
    age: validateAge(query.age),
    inStock: validateInStock(query.inStock),
    q: validateText(query.q),
    store: validateStore(query.store),
  };
  return validatedQuery;
};
