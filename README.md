# backend-technical-task

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
