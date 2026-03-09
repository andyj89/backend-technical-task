import { RawProduct } from '../types';

export const extractAgeData = (
  rawProduct: RawProduct,
): { minAge: number; maxAge: number } => {
  const minAges: number[] = [];
  const maxAges: number[] = [];

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

  // we get the min of each of these for minAge and the max for maxAge
  return {
    minAge: Math.min(...minAges),
    maxAge: Math.max(...maxAges),
  };
};

export const extractPrice = (
  rawProduct: RawProduct,
): { price: number; currency: string } | null => {
  const price = rawProduct.price ?? rawProduct.pricing?.current.amount;
  const currency = rawProduct.currency ?? rawProduct.pricing?.current.currency;

  if (!price || !currency) {
    return null;
  }

  return { price, currency };
};

export const extractStock = (
  rawProduct: RawProduct,
): { inStock: boolean; stockLevel: number } | null => {
  const stockLevel =
    rawProduct.stockLevel ??
    rawProduct.inventory?.stockLevel ??
    rawProduct.availability?.stock;

  if (stockLevel === undefined) {
    return null;
  }

  return {
    inStock: stockLevel > 0,
    stockLevel,
  };
};
