/*----------------------------------
- CONST
----------------------------------*/

const currencies = [
    "$", "US$", "US dollars", "USD",
    "£", "GBP",
    "€", "Euro", "EUR",
    "R$", "BRL",
    "lei", "LEI", "Lei", "RON",
    "руб", "RUB",
    "₪", "ILS",
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

type TAmount = { number: number, decsep?: string, grpsep?: string }
type TPrice = TAmount & { currency: string }

/*----------------------------------
- METHODES
----------------------------------*/

function matchAmount(str: string, debug: boolean = false): TAmount | null {

    let amountStr = '';
    let decsep: string | undefined;
    let grpsep: string | undefined;
    let grplength = 0;

    const strlength = str.length;
    for (let i = strlength - 1; i >= 0; i--) {

        let c = str[i];

        if (nb.includes(c)) {

            grplength++;

        } else if (seps.test(c)) {

            // Decimals séparator
            if (decsep === undefined || c === decsep) {

                if (grplength !== decSize) {
                    debug && console.log(`Bad decimals size:`, amountStr);
                    return null;
                }

                decsep = c;
                c = '.';

                // Groups separator
            } else {

                // If thousands separator has already been defined, it must always be the same
                if (grpsep !== undefined && grpsep !== c) {
                    debug && console.log(`Inexpected separator: "${c}"`);
                    break;
                }

                if (grplength !== thousandsSize) {
                    debug && console.log(`Bad thousands size:`, amountStr);
                    return null;
                }

                grpsep = c;
                c = '';

            }

            grplength = 0;

        } else {
            debug && console.log(`Inexpected caracter: "${c}"`);
            break;
        }

        amountStr = c + amountStr;
    }

    debug && console.log(str, '=>', amountStr, { grpsep, decsep });

    const number = parseFloat(amountStr);

    return { number, decsep, grpsep }

}

export function price(input: string, details: true, debug?: boolean): TPrice | null;
export function price(input: string, details?: false, debug?: boolean): number | null;
export function price(input: string, details: boolean = false, debug: boolean = false): TPrice | number | null {

    let currency: { symb: string, index: number } | null = null;
    for (const symb of currencies) {
        const index = input.indexOf(symb);
        if (index !== -1) {
            currency = { symb, index };
            break;
        }
    }

    if (currency === null) return null;

    let amount: TAmount | null = null;
    if (currency.index >= minAmountSize) {
        const strBefore = input.substring(0, currency.index).trim();
        amount = matchAmount(strBefore, debug);
    }

    if (amount === null && currency.index <= input.length - minAmountSize) {

        const strAfter = input.substring(currency.index + currency.symb.length).trim();
        amount = matchAmount(strAfter, debug);
    }

    if (amount === null)
        return null;

    return details ? { ...amount, currency: currency.symb } : amount.number;
}