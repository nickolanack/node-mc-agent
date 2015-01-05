var assert=require('assert');

var spatial=require('../math.js');



//this should tests points that make strait lines ie: x or z is constant while the other changes
//should text both x, and z straight lines

//lines that go in x=0 out x=1, in z=0 z=1

//lines that go in x=0 z=1
//lines that go in z=0 x=1


assert.deepEqual(
		{x:1,y:0,z:0.5},
		spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:0,y:0,z:0.5},{x:1,y:0,z:0.5})
		);

assert.deepEqual(
		{x:0,y:0,z:0.5},
		spatial.path2D.entersBlockAt({x:0,y:0,z:0},{x:0,y:0,z:0.5},{x:1,y:0,z:0.5})
		);


assert.deepEqual(
		{x:0,y:0,z:0.5},
		spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:1,y:0,z:0.5},{x:0,y:0,z:0.5})
		);


assert.deepEqual(
		{x:0.5,y:0,z:1},
		spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:0.5,y:0,z:0},{x:0.5,y:0,z:1})
		);

assert.deepEqual(
		{x:0.5,y:0,z:0},
		spatial.path2D.entersBlockAt({x:0,y:0,z:0},{x:0.5,y:0,z:0},{x:0.5,y:0,z:1})
		);

assert.deepEqual(
		{x:1,y:0,z:0.2}, 
		spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:0,y:0,z:0},{x:0.5,y:0,z:0.1})
		);


assert.deepEqual(
		{x:0.5,y:0,z:0},
		spatial.path2D.entersBlockAt({x:0,y:0,z:0},{x:0.5,y:0,z:0},{x:0.5,y:0,z:1})
		);

//positive into x=0 out x=1

assert.deepEqual(
		{x:0,y:0,z:0.25}, //0.25
		spatial.path2D.entersBlockAt({x:0,y:0,z:0},{x:-0.5,y:0,z:0},{x:1.5,y:0,z:1})
		);


assert.deepEqual(
		{x:1,y:0,z:0.75},
		spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:-0.5,y:0,z:0},{x:1.5,y:0,z:1})
		);


//negative slope 
assert.deepEqual(
		{x:0,y:0,z:0.75}, //0.25
		spatial.path2D.entersBlockAt({x:0,y:0,z:0},{x:-0.5,y:0,z:1},{x:1.5,y:0,z:0})
		);


assert.deepEqual(
		{x:1,y:0,z:0.25},
		spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:-0.5,y:0,z:1},{x:1.5,y:0,z:0})
		);



//positive slope in z=0. 
assert.deepEqual(
	{x:0.25,y:0,z:0}, //0.25
	spatial.path2D.entersBlockAt({x:0,y:0,z:0},{x:0,y:0,z:-0.5},{x:1,y:0,z:1.5})
);


assert.deepEqual(
	{x:0.75,y:0,z:1},
	spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:0,y:0,z:-0.5},{x:1,y:0,z:1.5})
);


//positive slope in z=1. 
assert.deepEqual(
	{x:0.25,y:0,z:1}, //0.25
	spatial.path2D.entersBlockAt({x:0,y:0,z:0},{x:0,y:0,z:1.5},{x:1,y:0,z:-0.5})
);


assert.deepEqual(
	{x:0.75,y:0,z:0},
	spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:0,y:0,z:1.5},{x:1,y:0,z:-0.5})
);


assert.deepEqual(
	{x:2/3,y:0,z:0},
	spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:0,y:0,z:2},{x:1,y:0,z:-1})
);

//in x=0 out z=1

assert.deepEqual(
	{x:0,y:0,z:0.5}, 
	spatial.path2D.entersBlockAt({x:0,y:0,z:0},{x:-0.5,y:0,z:0},{x:1,y:0,z:1.5})
);

assert.deepEqual(
	{x:0.5,y:0,z:1}, 
	spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:-0.5,y:0,z:0},{x:1,y:0,z:1.5})
);

//in z=0 out x=1
assert.deepEqual(
	{x:0.5,y:0,z:0}, 
	spatial.path2D.entersBlockAt({x:0,y:0,z:0},{x:0,y:0,z:-0.5},{x:1,y:0,z:0.5})
);

assert.deepEqual(
	{x:1,y:0,z:0.5}, 
	spatial.path2D.exitsBlockAt({x:0,y:0,z:0},{x:0,y:0,z:-0.5},{x:1,y:0,z:0.5})
);

var fn=spatial.path2D.functions({x:0,y:0,z:0},{x:5,y:0,z:5});
var tangents=spatial.path2D.contraintPaths(0.3, {x:0,y:0,z:0},{x:5,y:0,z:5});
var fn0=spatial.path2D.functions(tangents[0][0], tangents[0][1]);
var fn1=spatial.path2D.functions(tangents[1][0], tangents[1][1]);

//console.log(JSON.stringify([fn, fn0, fn1]));

assert.equal(fn0.offset,-0.3/Math.cos(Math.PI/4))
assert.equal(fn1.offset,+0.3/Math.cos(Math.PI/4))

assert(spatial.path2D.pathsAreParallel(tangents[0],[{x:0,y:0,z:0},{x:5,y:0,z:5}]));
assert(spatial.path2D.pathsAreParallel(tangents[1],[{x:0,y:0,z:0},{x:5,y:0,z:5}]));

assert.deepEqual(spatial.point3D.floor({x:0.5, y:0.5, z:0.5}),{x:0, y:0, z:0});
assert.deepEqual(spatial.point3D.ceil({x:0.5, y:-0.5, z:0.5}),{x:1, y:0, z:1});
assert.deepEqual(spatial.point3D.center({x:10.3, y:-5.9, z:0.7}),{x:10.5, y:-5.5, z:0.5});

//y is ignored in the following.
assert.deepEqual(spatial.point2D.floor({x:0.5, y:0.5, z:0.5}),{x:0, y:0.5, z:0});
assert.deepEqual(spatial.point2D.ceil({x:0.5, y:-0.5, z:0.5}),{x:1, y:-0.5, z:1});
assert.deepEqual(spatial.point2D.center({x:10.3, y:-5.9, z:0.7}),{x:10.5, y:-5.9, z:0.5});

assert.deepEqual(spatial.point3D.add({x:3, y:2, z:1},{x:1, y:2, z:3}), {x:4, y:4, z:4});

//ensure that sliceAt contains correct number of cells
assert.equal(spatial.grid2D.sliceAt({x:0,y:0,z:0}, 1).length, 9); 
assert.equal(spatial.grid2D.sliceAt({x:0,y:0,z:0}, 2).length, 25);
assert.equal(spatial.grid2D.sliceAt({x:0,y:0,z:0}, 0.5).length,4);

//returns the points around p, with p removed set diff
var diff=spatial.points2D.setDifference(spatial.grid2D.sliceAt({x:0,y:0,z:0}, 0.5),[{x:0,y:0,z:0}])
assert.equal(diff.length,3);



console.log('Testing Spatial Functions: Complete');
