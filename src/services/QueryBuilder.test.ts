import { describe, it, expect } from 'vitest';
import QueryBuilder from './QueryBuilder';

describe('QueryBuilder', () => {
  it('builds basic SELECT query', () => {
    const builder = new QueryBuilder();
    const { sql, params } = builder.select('*').from('products').build();

    expect(sql).toBe('SELECT * FROM products');
    expect(params).toEqual([]);
  });

  it('builds query with age filter', () => {
    const builder = new QueryBuilder();
    const { sql, params } = builder
      .select('*')
      .from('products')
      .whereAge(8)
      .build();

    expect(sql).toBe('SELECT * FROM products WHERE minAge <= ? AND maxAge >= ?');
    expect(params).toEqual([8, 8]);
  });

  it('builds query with inStock filter', () => {
    const builder = new QueryBuilder();
    const { sql, params } = builder
      .select('*')
      .from('products')
      .whereInStock(true)
      .build();

    expect(sql).toBe('SELECT * FROM products WHERE inStock = ?');
    expect(params).toEqual([1]);
  });

  it('builds query with text search filter', () => {
    const builder = new QueryBuilder();
    const { sql, params } = builder
      .select('*')
      .from('products')
      .whereTextSearch('toy')
      .build();

    expect(sql).toBe('SELECT * FROM products WHERE (title LIKE ? OR description LIKE ?)');
    expect(params).toEqual(['%toy%', '%toy%']);
  });

  it('builds query with multiple filters', () => {
    const builder = new QueryBuilder();
    const { sql, params } = builder
      .select('*')
      .from('products')
      .whereAge(8)
      .whereInStock(true)
      .whereTextSearch('toy')
      .build();

    expect(sql).toBe(
      'SELECT * FROM products WHERE minAge <= ? AND maxAge >= ? AND inStock = ? AND (title LIKE ? OR description LIKE ?)'
    );
    expect(params).toEqual([8, 8, 1, '%toy%', '%toy%']);
  });

  it('skips undefined filters', () => {
    const builder = new QueryBuilder();
    const { sql, params } = builder
      .select('*')
      .from('products')
      .whereAge(undefined)
      .whereInStock(undefined)
      .whereTextSearch(undefined)
      .build();

    expect(sql).toBe('SELECT * FROM products');
    expect(params).toEqual([]);
  });

  it('handles false for inStock filter', () => {
    const builder = new QueryBuilder();
    const { sql, params } = builder
      .select('*')
      .from('products')
      .whereInStock(false)
      .build();

    expect(sql).toBe('SELECT * FROM products WHERE inStock = ?');
    expect(params).toEqual([0]);
  });
});
