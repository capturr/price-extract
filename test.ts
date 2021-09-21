import extractPrice from './src';

const debug = true;

const ok = [
    '1 185,36 €', 
    '$ 1,185,456.36',
    'RUB 1185.36', 
    '118536£',
    'à partir de 39,99 €',
    'price1:439,99 €',
    'EUR 85,456.3', 
    'EUR 85,4556.34', 
    '$ 1.185,456.36',
    '$ 1.185,456.36.36',
]

const fail = [
    'There is no price here hahaha $$',
    'undefined €',
    '$$'
]

console.log('Should be ok:', ok.map(v => extractPrice(v, false, debug) ));

console.log('Should be null:', fail.map(v => extractPrice(v, false, debug) ));