# backend-technical-task


---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/andyj89/backend-technical-task.git
cd backend-technical-task
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Usage Examples

### Get Products by Age

Find all products suitable for 8-year-olds:
```bash
curl "http://localhost:3000/api/products?age=8"
```

### Filter by Stock Status

Get only in-stock products:
```bash
curl "http://localhost:3000/api/products?inStock=true"
```

### Text Search

Search for products containing "game":
```bash
curl "http://localhost:3000/api/products?q=game"
```

### Combined Filters

Find in-stock products for age 8 containing "puzzle":
```bash
curl "http://localhost:3000/api/products?age=8&inStock=true&q=puzzle"
```

### Response Format

```json
{
  "products": [
    {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "handle": "product-handle",
      "store": "UK",
      "title": "Example Product",
      "type": "game",
      "price": {
        "amount": 19.99,
        "currency": "GBP"
      },
      "ageSuitability": {
        "minAge": 6,
        "maxAge": 12
      },
      "inventory": {
        "stockLevel": 50,
        "inStock": true
      }
    }
  ],
  "metaData": {
    "count": 1,
    "filters": {
      "age": 8,
      "inStock": true,
      "q": "puzzle"
    }
  }
}
```

## Running Tests

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Load Tests

Requires Docker:
```bash
npm run test:load
```

## Production Build

```bash
npm run build
npm start
```

## Architecture

- **Express.js** - Web framework
- **SQLite** - In-memory database for fast queries
- **TypeScript** - Type safety
- **Vitest** - Unit and integration testing
- **k6** - Load testing

### Data Normalisation

The service handles inconsistent schemas by:

#### Age Data Extraction
- Collects age data from multiple sources:
  - `cards[].minAge` and `cards[].maxAge`
  - `variants[].ageRange.min` and `variants[].ageRange.max`
  - `recommendedAge` string (e.g., "4-10")
- **Merge strategy**: Takes the **minimum** of all `minAge` values and the **maximum** of all `maxAge` values
- **Rationale**: A product is suitable for an age if ANY variant/card/option supports that age. Using min/max ensures we capture the full age range across all purchasable options, making the product discoverable for the widest possible age range
- Products without any age data are filtered out during ingestion

#### Price Data Extraction
- Checks multiple locations in priority order:
  1. `price` (if number) or `price.amount` (if object)
  2. `pricing.current.amount`
- Currency extracted from:
  1. `currency`
  2. `price.currency`
  3. `pricing.current.currency`
- **Merge strategy**: Uses the **first available** value found in the priority order
- Products without both price and currency are filtered out during ingestion

#### Stock Data Extraction
- Checks multiple locations in priority order:
  1. `stockLevel`
  2. `inventory.stockLevel`
  3. `availability.stock`
- **Merge strategy**: Uses the **first available** value found
- `inStock` is calculated as `stockLevel > 0`
- Products without stock data are filtered out during ingestion



## Overview

You are integrating with a third-party e-commerce platform's product API. The API returns product data in inconsistent formats (different product types use different schemas). Your task is to build a service that:

1. Ingests product data from the third-party API
2. Normalizes the data into a consistent product model
3. Exposes your own API to query products efficiently

## The Third-Party API

For this exercise, the third-party API is simulated by a JSON file containing ~1000 products under a top-level "products" array. Treat this as if you were calling a real external API - the data structure is outside your control and may be inconsistent.

Dataset location: [products_1000_mixed_schema](/products_1000_mixed_schema.json)

The data uses mixed schemas - age suitability, pricing, stock, and media fields appear in different locations depending on the product type.

**Examples of schema inconsistencies:**

Age data might appear as:

- cards[].minAge / cards[].maxAge
- variants[].ageRange.min / variants[].ageRange.max
- recommendedAge as a string (e.g., "4-10")

**Other inconsistent fields:**

- Price: price vs pricing.current.amount
- Stock: stockLevel vs inventory.stockLevel vs availability.stock

## Core Requirements

**Endpoint requirements:**

- Find all products suitable for a given age (e.g., ?age=8)
- Optional filters (nice to have):
    - Store filter (e.g., filter by UK only products)
    - Text search (title/description contains a specific string)
    - Stock filter (show in stock only products)

**Response format:**

- Each returned product must include at minimum:
    - Identity: uuid, handle, store, title, type
    - Age suitability (normalized)
    - Price + currency
    - Stock/availability status

**Age matching rules:**

- A product is suitable for age X if any purchasable option (variant/edition/card) supports that age
- Age ranges are inclusive: min ≤ X ≤ max
- If age appears in multiple places, document how you merge or prioritize values

**Performance Expectations**

This API will experience high traffic during peak events (e.g., Black Friday). Design with the following expected peak load in mind:
- List endpoints: ~40 requests/second

## Deliverables

- A copy of the sourcecode (ideally a link to a repo that we can access)
- Documentation with:
  - Setup instructions
  - API usage examples

### Technology Choice

Use whatever language and framework you're most comfortable with. The only requirement is that interviewers can easily inspect and run your solution locally.

For reference, our backend team primarily uses TypeScript/Node.js, but this is not a requirement.
