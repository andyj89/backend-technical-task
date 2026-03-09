export default class QueryBuilder {
  private selectClause = '';
  private fromClause = '';
  private conditions: string[] = [];
  private params: any[] = [];

  select(columns: string): this {
    this.selectClause = `SELECT ${columns}`;
    return this;
  }

  from(table: string): this {
    this.fromClause = `FROM ${table}`;
    return this;
  }

  whereAge(age?: number): this {
    if (age !== undefined) {
      this.conditions.push('minAge <= ? AND maxAge >= ?');
      this.params.push(age, age);
    }
    return this;
  }

  whereStore(store?: string): this {
    if (store) {
      this.conditions.push('store = ?');
      this.params.push(store);
    }
    return this;
  }

  whereInStock(inStock?: boolean): this {
    if (inStock !== undefined) {
      this.conditions.push('inStock = ?');
      this.params.push(inStock ? 1 : 0);
    }
    return this;
  }

  whereTextSearch(text?: string): this {
    if (text) {
      this.conditions.push('(title LIKE ? OR description LIKE ?)');
      const searchTerm = `%${text}%`;
      this.params.push(searchTerm, searchTerm);
    }
    return this;
  }

  build(): { sql: string; params: any[] } {
    const whereClause =
      this.conditions.length > 0
        ? `WHERE ${this.conditions.join(' AND ')}`
        : '';
    const sql = `${this.selectClause} ${this.fromClause} ${whereClause}`.trim();
    return { sql, params: this.params };
  }
}
