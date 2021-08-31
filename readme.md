# JSON Deep Equal

Extract price amount and metas (currency, decimal & thousand separator) without using any regex.

[![npm](https://img.shields.io/npm/v/@dopamyn/price-extract)](https://www.npmjs.com/package/@dopamyn/price-extract)

## Installation

```bash
npm install --save @dopamyn/price-extract
```

## Usage

```typescript
extractPrice( input: string, details?: boolean = false, debug?: boolean = false ): TPrice | number | null;
```

## Usage example

```typescript
import extractPrice from '@dopamyn/price-extract';

console.log(
    'Should be ok:',
    ...['1 185,36 €', '$ 1,185,456.36', 'RUB 1185.36', '118536£'].map(v => price(v, false, true))
);

console.log(
    'Should be null:',
    ...['EUR 85,456.3', 'EUR 85,4556.34', '$ 1.185,456.36'].map(v => price(v, false, true))
);
```