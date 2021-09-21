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

    let decsep: string | undefined;
    let grpsep: string | undefined;

    let currentGroup = '';
    let parsedAmount = '';

    debug && console.log(`[extractAmount] Extracting amount from "${str}"`);

    const strlength = str.length;
    // We go until -1 to process the last character sof the stirng
    for (let i = strlength - 1; i >= -1; i--) {

        let c = str[i];
        const endOfString = i === -1;
        
        // Number: add to group
        if (nb.includes(c)) {

            currentGroup = c + currentGroup;

        // Other: check & commit current group
        } else {

            const grpLength = currentGroup.length;
            const isDecimals = decsep === undefined;

            // Decimals group
            if (isDecimals) {

                // Group size
                if (!endOfString && grpLength > decSize) {
                    debug && console.log(`[extractAmount] Bad decimals size for "${currentGroup}":`, grpLength, ', should be <=', decSize, '. Invalidating the input.');
                    return null;
                }

                debug && console.log(`[extractAmount] New decimals group:`, currentGroup);
                parsedAmount = currentGroup;

                if (endOfString) {
                    debug && console.log(`[extractAmount] End of string.`);
                    break;
                }
                
            // Thousands group
            } else {

                debug && console.log(`[extractAmount] New thousands group:`, currentGroup);
                parsedAmount = currentGroup + (grpsep === undefined ? '.' : '') + parsedAmount;

                if (!endOfString) {

                    // No thousands separator
                    if (grpsep === undefined) {

                        if (grpLength > thousandsSize) {
                            debug && console.log(`[extractAmount] Thousands separator is empty`);
                            grpsep = '';
                        }

                    // If thousands separator has already been defined, it must always be the same
                    } else if (c !== grpsep) {

                        debug && console.log(`[extractAmount] "${c}" is not mathing the current thousands separator "${grpsep}". Closing group.`);
                        break;

                    }

                    if (grpLength !== thousandsSize) {
                        debug && console.log(`[extractAmount] "${currentGroup}" is the last thousands group (length < ${thousandsSize}). Closing group.`);
                        break;
                    }

                } else {
                    debug && console.log(`[extractAmount] End of string.`);
                    break;
                }

            }

            currentGroup = '';

            if (seps.test(c)) {

                if (isDecimals)
                    decsep = c;
                else
                    grpsep = c;

            } else {
                debug && console.log(`[extractAmount] Inexpected character: "${c}" (Not a number, not a separator). Closing group.`);
                break;
            }

        }
    } 

    debug && console.log('[extractAmount]', `"${str}" => "${parsedAmount}"`, { grpsep, decsep });

    if (parsedAmount === '')
        return null;

    const number = parseFloat(parsedAmount);

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

    debug && console.log(`--------------------------------`);
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