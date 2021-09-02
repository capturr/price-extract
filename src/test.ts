import extractPrice from '.';

console.log(
    'Should be ok:',
    ...['1 185,36 €', '$ 1,185,456.36', 'RUB 1185.36', '118536£'].map(v => extractPrice(v, false, true))
);

console.log(
    'Should be null:',
    ...['EUR 85,456.3', 'EUR 85,4556.34', '$ 1.185,456.36'].map(v => extractPrice(v, false, true))
);