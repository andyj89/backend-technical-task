# Load Testing

## Prerequisites

- Docker installed and running
- Server running locally on port 3000

## Running Load Tests

1. Start the server:
```bash
npm run dev
```

2. In another terminal, seed the database:
```bash
curl -X POST http://localhost:3000/api/products/ingest \
  -H "Content-Type: application/json" \
  -d '{"path": "./products_1000_mixed_schema.json"}'
```

3. Run the load test:
```bash
npm run test:load
```

Or with a custom URL:
```bash
./load-tests.sh http://your-server:3000
```

## Test Configuration

- Stage 1: 30 seconds @ 20 requests/second
- Stage 2: 1 minute @ 100 requests/second
- Random ages: 3-15
- Random search terms: game, book, toy, puzzle, card, adventure, learning, creative, fun, educational

## Thresholds

- p99 response time: < 100ms
- Error rate: < 1%
