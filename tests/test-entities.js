var assert=require('assert');

var entities=require('../mc-entity-list.js');


assert.equal(entities.mobIdToString(120),'Villager');
assert.equal(entities.objectIdToString(90),'Fishing Float');



console.log('Testing Entity Functions: Complete');