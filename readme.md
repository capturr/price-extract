# Extract Price from String

Performant way to extract price amount and metadatas (currency, decimal & thousands separator) from any string.

[![npm](https://img.shields.io/npm/v/price-extract)](https://www.npmjs.com/package/price-extract)

## Installation

```bash
npm install --save price-extract
```

## Usage

```typescript
extractPrice( input: string, details?: boolean = false, debug?: boolean = false ): TPrice | number | null;
```

## Usage example

```typescript
import extractPrice from 'price-extract';

console.log(
    'Should be ok:',
    ...['1 185,36 €', '$ 1,185,456.36', 'RUB 1185.36', '118536£'].map(v => price(v, false, true))
);

console.log(
    'Should be null:',
    ...['EUR 85,456.3', 'EUR 85,4556.34', '$ 1.185,456.36'].map(v => price(v, false, true))
);
```