# Extract Price from String

Performant way to extract price amount and metadatas (currency, decimal & thousands separator) from any string.

[![npm](https://img.shields.io/npm/v/price-extract)](https://www.npmjs.com/package/price-extract)

## Installation

```bash
npm install --save price-extract
```

## API

```typescript
extractPrice( 
    input: string, 
    details?: boolean = false, 
    debug?: boolean = false 
): TPrice | number | null;

type TAmount = { 
    number: number, 
    decsep?: string, 
    grpsep?: string 
}

type TCurrency = { 
    symbol: string, 
    iso: string, 
    match: string, 
    index: number 
}

type TPrice = TAmount & { currency: TCurrency }
```

## Return Value

* **null**: When the price could not be parsed
* **number**: The extracted price value
* **object**: The extract price informations (when details = true)

## Example

```typescript
import extractPrice from 'price-extract';

console.log(
    
    extractPrice('starting from 1 185,36 € (including taxes)'),
    /* 1185.36 */

    extractPrice('$ 85,4556.34'),
    /* 556.34 */

    extractPrice('There is no price here hahaha $$'),
    /* null */
    
    extractPrice('12,456.24 USD', true), 
    /* { 
        number: 12456.24, 
        decsep: '.', 
        grpsep: ',', 
        currency: { 
            symbol: '$', 
            iso: 'USD', 
            match: 'USD',
            index: 10
        } 
    } */
);
```