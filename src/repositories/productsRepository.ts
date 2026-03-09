import { DatabaseSync } from 'node:sqlite';
import { NormalisedProduct, StoreProduct } from '../types';

export class ProductsRepository {
  constructor(private db: DatabaseSync) {
    this.initialiseDb();
  }

  initialiseDb(): void {
    // initialise the database
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        uuid TEXT PRIMARY KEY,
        handle TEXT,
        store TEXT,
        title TEXT,
        type TEXT,
        minAge INTEGER,
        maxAge INTEGER,
        price REAL,
        currency TEXT,
        inStock BOOLEAN,
        stockLevel INTEGER
      )
    `);

    // create some indexes for performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_age_range ON products(minAge, maxAge);
      CREATE INDEX IF NOT EXISTS idx_store ON products(store);
      CREATE INDEX IF NOT EXISTS idx_title ON products(title);
      CREATE INDEX IF NOT EXISTS idx_inStock ON products(inStock);
    `);
  }

  insertProducts(products: NormalisedProduct[]): number {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO products (
        uuid, handle, store, title, type, minAge, maxAge, price, currency, inStock, stockLevel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.db.exec('BEGIN TRANSACTION');
    try {
      let rowsAffected = 0;
      for (const product of products) {
        const result = insert.run(
          product.uuid,
          product.handle,
          product.store,
          product.title,
          product.type,
          product.minAge,
          product.maxAge,
          product.price,
          product.currency,
          product.inStock ? 1 : 0,
          product.stockLevel,
        );
        rowsAffected += Number(result.changes);
      }
      this.db.exec('COMMIT');
      return rowsAffected;
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  findByAge(age: number): StoreProduct[] {
    const query = this.db.prepare(`
      SELECT * FROM products
      WHERE minAge <= ? AND maxAge >= ?
    `);

    const rows = query.all(age, age) as any[];

    return rows.map(this.transformRow);
  }

  private transformRow(row: any): StoreProduct {
    return {
      uuid: row.uuid,
      handle: row.handle,
      store: row.store,
      title: row.title,
      type: row.type,
      inventory: {
        stockLevel: row.stockLevel,
        inStock: row.inStock === 1,
      },
      price: {
        currency: row.currency,
        amount: row.price,
      },
      ageSuitability: {
        maxAge: row.maxAge,
        minAge: row.minAge,
      },
    };
  }
}
