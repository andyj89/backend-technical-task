export type ValidatedQuery = {
  age?: number;
  inStock?: boolean;
  q?: string;
  store?: string;
};

export type RawProduct = {
  store: string;
  uuid: string;
  handle: string;
  title: string;
  type: string;
  age?: { min: number; max: number };
  price?: number;
  originalPrice?: number;
  currency?: string;
  stockLevel?: number;
  headline?: string;
  description?: string;
  recommendedAge?: string;
  coverUrls?: Array<{ url: string; text?: string; caption?: string }>;
  inventory?: { stockLevel: number };
  availability?: { stock: number; status?: string };
  pricing?: {
    current: { amount: number; currency: string };
    was?: { amount: number; currency: string };
  };
  assets?: { coverUrls?: Array<{ url: string; caption?: string }> };
  media?: { covers?: Array<{ url: string; text?: string }> };
  cards?: Array<{
    variant: string;
    minAge?: number;
    maxAge?: number;
    previewAudioUrl?: string;
    metaFields?: any;
    contents?: any[];
  }>;
  variants?: Array<{
    format: string;
    ageRange?: { min: number; max: number };
    preview?: { audio?: string };
    metadata?: any;
    contents?: any[];
  }>;
  packages?: Array<{
    variant: string;
    previewUrl?: string;
    meta?: any;
    items?: any[];
  }>;
};

export type NormalisedProduct = {
  uuid: string;
  handle: string;
  title: string;
  description?: string;
  price: number;
  type: string;
  minAge: number;
  maxAge: number;
  inStock: boolean;
  stockLevel: number;
  store: string;
  currency: string;
};

export type StoreProduct = {
  uuid: string;
  handle: string;
  title: string;
  description?: string;
  type: string;
  store: string;
  price: {
    amount: number;
    previous?: number;
    currency: string;
  };
  ageSuitability: {
    maxAge: number;
    minAge: number;
  };
  inventory: {
    stockLevel: number;
    inStock: boolean;
  };
};
