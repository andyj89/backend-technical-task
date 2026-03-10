import ClientError from './errors/ClientError.js';

export type QueryValue = string | string[] | undefined;

export type ValidatedQuery = {
  age?: number;
  inStock?: boolean;
  q?: string;
  store?: string;
};

const getFirstValue = (value: QueryValue): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const validateAge = (age: QueryValue): number | undefined => {
  const ageStr = getFirstValue(age);
  if (!ageStr) return undefined;
  
  const numAge = Number(ageStr);
  if (Number.isNaN(numAge)) {
    throw new ClientError('age is not a valid number', 400);
  }
  return numAge;
};

export const validateText = (text: QueryValue): string | undefined => {
  const textStr = getFirstValue(text);
  if (!textStr) return undefined;
  
  if (textStr.length > 1000) {
    throw new ClientError('query parameter too long', 400);
  }
  return textStr;
};

export const validateInStock = (stock: QueryValue): boolean | undefined => {
  const stockStr = getFirstValue(stock);
  if (!stockStr) return undefined;
  
  if (stockStr !== 'true' && stockStr !== 'false') {
    throw new ClientError('stock is not a valid boolean', 400);
  }
  return stockStr === 'true';
};

const validateStore = (store: QueryValue): string | undefined => {
  const storeStr = getFirstValue(store);
  if (!storeStr) return undefined;
  
  if (storeStr.length > 10) {
    throw new ClientError('store parameter too long', 400);
  }
  return storeStr;
};

export const validateQuery = (query: Record<string, any>): ValidatedQuery => {
  return {
    age: validateAge(query.age),
    inStock: validateInStock(query.inStock),
    q: validateText(query.q),
    store: validateStore(query.store),
  };
};
