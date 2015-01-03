var assert=require('assert');

var entities=require('../mc-entity-list.js');

assert.equal(entities.mobs[0].length,entities.mobs[1].length);
assert.equal(entities.mobIdToString(120),'Villager');

assert.equal(entities.objects[0].length,entities.objects[1].length);
assert.equal(entities.objectIdToString(90),'Fishing Float');



console.log('Testing Entity Functions: Complete');