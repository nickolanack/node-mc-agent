var assert=require('assert');

var items=require('../mc-item-list.js');


assert.equal(items.idToString(0),'Air');
assert.equal(items.idToString(1),'Stone');


assert.equal(items.idToString('1:1'),'Granite');

console.log('Testing Item Functions: Complete');