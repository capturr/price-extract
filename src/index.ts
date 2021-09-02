/*----------------------------------
- CONST
----------------------------------*/

// From https://github.com/mindtricksdev/parse-money/blob/master/src/index.ts
// [symbol, iso, ...other]
const currencies: string[][] = [
    ["R$", "BRL"],
    ["lei", "RON", "LEI", "Lei"],
    ["$", "USD", "US$", "US dollars"],
    ["£", "GBP"],
    ["€", "EUR", "Euro"],
    ["руб", "RUB"],
    ["₪", "ILS"],
]

const seps = /\s|\.|,/
const nb = '0123456789'

const thousandsSize = 3;
const decSize = 2;
// Min size of amount: 4 ( 1,23 )
const minAmountSize = decSize + 2;

/*----------------------------------
- TYPES
----------------------------------*/

export type TAmount = { 
    number: number, 
    decsep?: string, 
    grpsep?: string 
}

export type TCurrency = { 
    symbol: string, 
    iso: string, 
    match: string, 
    index: number 
}

export type TPrice = TAmount & { currency: TCurrency }

/*----------------------------------
- METHODES
----------------------------------*/

export function extractAmount(str: string, debug: boolean = false): TAmount | null {

    let amountStr = '';
    let decsep: string | undefined;
    let grpsep: string | undefined;
    let grplength = 0;

    debug && console.log(`[extractAmount] Extracting amount from "${str}"`);

    const strlength = str.length;
    for (let i = strlength - 1; i >= 0; i--) {

        let c = str[i];

        if (nb.includes(c)) {

            grplength++;

        } else if (seps.test(c)) {

            // Decimals séparator
            if (decsep === undefined || c === decsep) {

                if (grplength !== decSize) {
                    debug && console.log(`[extractAmount] Bad decimals size:`, amountStr);
                    return null;
                }

                decsep = c;
                c = '.';

            // Groups separator
            } else {

                // If thousands separator has already been defined, it must always be the same
                if (grpsep !== undefined && grpsep !== c) {
                    debug && console.log(`[extractAmount] Inexpected separator: "${c}"`);
                    break;
                }

                if (grplength !== thousandsSize) {
                    debug && console.log(`[extractAmount] Bad thousands size:`, amountStr);
                    return null;
                }

                grpsep = c;
                c = '';

            }

            grplength = 0;

        } else {
            debug && console.log(`[extractAmount] Inexpected caracter: "${c}"`);
            break;
        }

        amountStr = c + amountStr;
    }

    debug && console.log('[extractAmount]', str, '=>', amountStr, { grpsep, decsep });

    const number = parseFloat(amountStr);

    return { number, decsep, grpsep }

}

export function extractCurrency( input: string ): TCurrency | null {

    for (const expressions of currencies) {
        for (const expression of expressions) {

            const index = input.indexOf(expression);
            if (index !== -1)
                return {
                    symbol: expressions[0],
                    iso: expressions[1],
                    match: expression,
                    index
                };

        }
    }

    return null;

}

export default function extractPrice( input: string, details: true, debug?: boolean ): TPrice | null;
export default function extractPrice( input: string, details?: false, debug?: boolean ): number | null;
export default function extractPrice( input: string, details: boolean = false, debug: boolean = false ): TPrice | number | null {

    debug && console.log(`[extractPrice] Input: "${input}"`);

    const currency = extractCurrency(input);
    if (currency === null) {
        debug && console.log(`[extractPrice] No currency symbol found in the given input: "${input}"`);
        return null;
    }

    debug && console.log(`[extractPrice] Currency =`, currency);

    let amount: TAmount | null = null;
    if (currency.index >= minAmountSize) {
        const strBefore = input.substring(0, currency.index).trim();
        amount = extractAmount(strBefore, debug);
    }

    if (amount === null && currency.index <= input.length - minAmountSize) {
        const strAfter = input.substring(currency.index + currency.match.length).trim();
        amount = extractAmount(strAfter, debug);
    }

    if (amount === null)
        return null;

    return details ? { ...amount, currency: currency } : amount.number;

}