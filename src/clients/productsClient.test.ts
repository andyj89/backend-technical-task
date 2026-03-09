import { describe, it, expect, vi } from 'vitest';
import { createProductsClient } from './productsClient.js';
import { readFile } from 'node:fs/promises';

vi.mock('node:fs/promises');

describe('createProductsClient', () => {
  it('reads from file path', async () => {
    const mockData = {
      products: [
        {
          uuid: '1',
          store: 'uk',
          handle: 'test',
          title: 'Test',
          type: 'single',
        },
      ],
    };
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockData));

    const client = createProductsClient();
    const result = await client.fetchProducts('./products.json');

    expect(result).toEqual(mockData);
    expect(readFile).toHaveBeenCalledWith('./products.json', 'utf-8');
  });

  it('throws when file does not exist', async () => {
    vi.mocked(readFile).mockRejectedValue(new Error('ENOENT: no such file'));

    const client = createProductsClient();

    await expect(client.fetchProducts('./missing.json')).rejects.toThrow(
      'ENOENT: no such file',
    );
  });

  it('throws when JSON is invalid', async () => {
    vi.mocked(readFile).mockResolvedValue('invalid json');

    const client = createProductsClient();

    await expect(client.fetchProducts('./invalid.json')).rejects.toThrow();
  });
});
