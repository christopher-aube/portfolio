import list from './utls/list';

var numList = [
    {
        name: 'one',
        value: 1
    },
    {
        name: 'two',
        value: 2
    },
    {
        name: 'three',
        value: 3
    }
];

console.log('index of one: ', list.lookupIndex(numList, 'value', 1));