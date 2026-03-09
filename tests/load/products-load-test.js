import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 20,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
    ramped_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 200,
      maxVUs: 300,
      startTime: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(99)<100'],
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const searchTerms = [
  'game', 'book', 'toy', 'puzzle', 'card',
  'adventure', 'learning', 'creative', 'fun', 'educational'
];

function randomAge() {
  return Math.floor(Math.random() * 13) + 3; // 3-15
}

function randomSearchTerm() {
  return searchTerms[Math.floor(Math.random() * searchTerms.length)];
}

export default function () {
  const age = randomAge();
  const searchTerm = randomSearchTerm();

  const scenarios = [
    { url: `${BASE_URL}/api/products?age=${age}`, name: 'age filter' },
    { url: `${BASE_URL}/api/products?inStock=true`, name: 'stock filter' },
    { url: `${BASE_URL}/api/products?q=${searchTerm}`, name: 'text search' },
    { url: `${BASE_URL}/api/products?age=${age}&inStock=true`, name: 'combined filters' },
    { url: `${BASE_URL}/api/products`, name: 'all products' },
  ];

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  const res = http.get(scenario.url);

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response has products': (r) => JSON.parse(r.body).products !== undefined,
  });

  errorRate.add(!success);
}
