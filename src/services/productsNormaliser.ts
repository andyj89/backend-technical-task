import { RawProduct } from '../types';

export const extractAgeData = (
  rawProduct: RawProduct,
): { minAge: number; maxAge: number } | null => {
  const minAges: number[] = [];
  const maxAges: number[] = [];

  if (rawProduct?.age?.min) minAges.push(rawProduct.age.min);
  if (rawProduct?.age?.max) maxAges.push(rawProduct.age.max);

  // From cards
  rawProduct.cards?.forEach((c) => {
    if (c.minAge) minAges.push(c.minAge);
    if (c.maxAge) maxAges.push(c.maxAge);
  });

  // From variants
  rawProduct.variants?.forEach((v) => {
    if (v.ageRange?.min) minAges.push(v.ageRange.min);
    if (v.ageRange?.max) maxAges.push(v.ageRange.max);
  });

  // From recommendedAge string
  if (rawProduct.recommendedAge) {
    const [min, max] = rawProduct.recommendedAge
      .split('-')
      .map((age: string) => parseInt(age.trim()));
    if (!isNaN(min)) minAges.push(min);
    if (!isNaN(max)) maxAges.push(max);
  }

  if (minAges.length === 0 || maxAges.length === 0) {
    return null;
  }

  // we get the min of each of these for minAge and the max for maxAge
  return {
    minAge: Math.min(...minAges),
    maxAge: Math.max(...maxAges),
  };
};

const extractPriceAmount = (rawProduct: RawProduct): number | null => {
  if (typeof rawProduct.price === 'number') {
    return rawProduct.price;
  }
  
  if ((rawProduct as any).price?.amount) {
    return (rawProduct as any).price.amount;
  }
  
  if (rawProduct.pricing?.current.amount) {
    return rawProduct.pricing.current.amount;
  }
  
  return null;
};

const extractCurrency = (rawProduct: RawProduct): string | null => {
  if (rawProduct.currency) {
    return rawProduct.currency;
  }
  
  if ((rawProduct as any).price?.currency) {
    return (rawProduct as any).price.currency;
  }
  
  if (rawProduct.pricing?.current.currency) {
    return rawProduct.pricing.current.currency;
  }
  
  return null;
};

export const extractPrice = (
  rawProduct: RawProduct,
): { price: number; currency: string } | null => {
  const price = extractPriceAmount(rawProduct);
  const currency = extractCurrency(rawProduct);

  if (!price || !currency) {
    return null;
  }

  return { price, currency };
};

export const extractStock = (
  rawProduct: RawProduct,
): { inStock: boolean; stockLevel: number } | null => {
  let stockLevel: number | undefined;
  
  if (rawProduct.stockLevel !== undefined) {
    stockLevel = rawProduct.stockLevel;
  } else if (rawProduct.inventory?.stockLevel !== undefined) {
    stockLevel = rawProduct.inventory.stockLevel;
  } else if (rawProduct.availability?.stock !== undefined) {
    stockLevel = rawProduct.availability.stock;
  } else if ((rawProduct as any).stock !== undefined) {
    stockLevel = (rawProduct as any).stock;
  }

  if (stockLevel === undefined) {
    return null;
  }

  return {
    inStock: stockLevel > 0,
    stockLevel,
  };
};
