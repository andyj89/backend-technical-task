# Load Testing

## Prerequisites

- Docker installed and running
- Server running locally on port 3000

## Running Load Tests

1. Start the server (data is auto-seeded on startup):
```bash
npm install
npm run build
PORT=3000 npm run start
```

2. Wait for "Ingested X products" message, then run the load test:
```bash
PORT=3000 npm run test:load
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

- p99 response time: < 50ms
- Error rate: < 10%
