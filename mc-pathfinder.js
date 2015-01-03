module.exports = {
		createPathfinder: createPathfinder
}

var spatial=require('./math.js');

function createPathfinder(scog){
	
	var pathfinder new Pathfinder(scog);
	
	
	pathfinder.setNeighbourFunction(function(point){
		return scog.floorNeighbours(point);
	});
	
	pathfinder.setEqualityFunction(function(a, b){
		
	});
	
	pathfinder.setGFunction(function(n, c, to){
		return c.g+spatial.path2D.measure(c, n);
	});
	
	pathfinder.setHFunction(function(n, c, to){
		return spatial.path2D.measure({x:n.x+0.5, y:n.y, z:n.z+0.5}, to);
	});

	pathfinder.setFFunction(function(n, c, to){
		return n.g+n.h;
	});
	
	
}

var events=require('events');
function Pathfinder(scog){
	
	var me=this;
	events.EventEmitter.call(me);
	me.scog=scog;
	
	
}

Pathfinder.prototype.__proto__ = events.EventEmitter.prototype;
Pathfinder.prototype.setGFunction(f){
	var me=this;
	me._g=f;
};

Pathfinder.prototype.setHFunction(f){
	var me=this;
	me._h=f;
};

Pathfinder.prototype.setFFunction(f){
	var me=this;
	me._f=f;
};

Pathfinder.prototype.setEqualityFunction(f){
	var me=this;
	me._equals=f;
};

Pathfinder.prototype.setNeighbourFunction(f){
	var me=this;
	me._next=f;
};


Pathfinder.prototype.route=function(from, to, time, callback){
	var me=this;
	var goal=me.scog.findFloor(to);
	var start=me.scog.findFloor(from);
	
	console.log('Path Finder: '+JSON.stringify({from:from, to:to}));
	
	var path=me.astar(start, goal);
	me.scog.printFloorplan(me.scog.coordsToFloorplan(path));
	
	//TODO: start following this path
	
	
}
/**
 * create a route from point to dest. 
 * 
 * astar(scog.findFloor(start), scog.findFloor(goal));
 * 
 */
Pathfinder.prototype.astar=function(from, to){

	//Here is an implementation of the A* shortest path algorithm.
	//Pathfinder.route(...) is called by movement (me-movement.js) 
	//when walkTo or runTo encounters an object that it cannot walk 
	//through or simply jump over. 
	
	var me=this;
	
	var open=[]; //maintain a list of open nodes (positions) 
	var closed=[]; //same for closed positions. 
	
	//assign g, and h values directly to the start object. 
	//hmm, is .h necessary?
	from.g=0;
	from.h=spatial.path2D.measure(from, to); 
	
	open.push(from); //will be processed right away and moved into closed
	var max=500; //this can be removed once I'm sure that i don't accidentally program an infinite loop
	var i=0;
	while(open.length){
		if(max--<=0){
			console.log('took too long');
			return false;
		}
		console.log(i);
		
		//c is the position to check during this round.
		var c=open.shift();
		
		
		if(me.scog.isEqualTo(c, to)){
			//c is the goal, so we are finished. just reconstruct the path from c to start. 
			//c.parent.parent.parent.... all the way to start.
			console.log('done reconstruct');
			
			
			var path=[to];
			//create a flat list of positions iterating c.parent.parent...etc
			while(c.parent){
				path.push({x:c.x, y:c.y, z:c.z}); //discard h, g, and f values 
				c=c.parent;
			}
			
			
			
			return path;
		}
		
		
		closed.push(c);
		
		
		//floorNeighbours returns array of block positions that are floor blocks.
		me.scog.floorNeighbours(c).forEach(function(n){
			if(me.scog.positionListContains(closed, n)||(c.y-n.y)!=0){
				//console.log('skip '+JSON.stringify(n));
				
				return;
			}
			
			var dx=c.x-n.x;
			var dz=c.z-n.z;
			
			if(dx!=0&&dz!=0){
				//no angles...
				return;
			}
			
			n.parent=c;
			n.g=c.g+spatial.path2D.measure(c, n);
			n.h=spatial.path2D.measure({x:n.x+0.5, y:n.y, z:n.z+0.5}, to);
			n.f=n.g+n.h;
			
			if(!me.scog.positionListContains(open, n)){
				open.push(n);
			}else{
				//check item in open list and compare 'g' if
				//this g is less then replace.
			}
			
		});
		
		//sort the list of open nodes such that the node that is closest to the end
		//will be processed first on the next round
		open.sort(function(a, b){
			return a.f-b.f;
		});
		
//		console.log('open length: '+open.length);
//		console.log('closed length: '+closed.length);
//		open.forEach(function(o){
//			console.log(o.f);
//		});
		
	}
	console.log('no path');
	
};