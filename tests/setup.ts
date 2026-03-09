import { app } from '../src/server.js';
import http from 'node:http';
import { resolve } from 'node:path';

export class TestServer {
  private server: http.Server;
  private port: number;

  constructor(port = 3000) {
    this.server = http.createServer(app);
    this.port = port;
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(`Test server listening on port ${this.port}`);
        resolve();
      });
    });
  }

  async seedData(): Promise<void> {
    const productsPath = resolve(
      process.cwd(),
      'products_1000_mixed_schema.json',
    );
    const response = await fetch(
      `http://localhost:${this.port}/api/products/ingest`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: productsPath }),
      },
    );
    const data = await response.json();
    return data;
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => resolve());
    });
  }
}
