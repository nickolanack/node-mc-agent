
var spatial=require('./math.js');
var items=require('./mc-item-list.js');

function createSpatialCognizance(client){
	
	var scog=new SpatialCognizance();	
	
//	setInterval(function(){
//		
//		scog.list();
//		
//	},10000);

	client.on('map_chunk',function(data){
		//console.log('map_chunk: '+JSON.stringify(data));
	});
	
	client.on('multi_block_change',function(data){
		//console.log('multi_block_change: '+JSON.stringify(data));
	});
	
	client.on('block_change',function(data){
		console.log('block_change: '+JSON.stringify(data));
		var blocktype=data.type
		var id=blocktype>>4;
    	var meta=blocktype&0xF;
    	
		scog.updateBlock(data.position, [id, meta]);
	});

	
	client.on('block_action',function(data){
		//console.log('block_action: '+JSON.stringify(data));
	});

	client.on('block_break_animation',function(data){
		//console.log('block_break_animation: '+JSON.stringify(data));
	});

	
	client.on('map_chunk_bulk',function(data){
		var chunkdata=data.data;
		delete data.data;
		
		var sizeOfChunk=Math.pow(16,3)*2; //bytes per non empty chunk
		
		//console.log(JSON.stringify(data)+' chunkdata['+chunkdata.length+']');
		var cursor=0;
		data.meta.forEach(function(chunkmeta){
			
			
			var cz=chunkmeta.z;
			var cx=chunkmeta.x;
			
			var continuous=true;
			var skylight=data.skyLightSent;
			
			
		
			
			for(var cy=0;cy<16;cy++) {
				
				//console.log('chunk: x:'+cx+', x:'+cy+', x:'+cz)
				
			    if (chunkmeta.bitMap & (1 << cy)) {
			    	
			    	
			    	/*
			    	
			    	
			    	var chunk=[];
			    	
			    	for(var y=0;y<16;y++){
			    		
			    		chunk[y]=[];
			    		
			    		for(var z=0;z<16;z++){
			    			
			    			chunk[y][z]=[];
			    			
			    			for(var x=0;x<16;x++){
			    				
			    				
			    				
			    				
			    				var blocktype=chunkdata.readUInt16LE(cursor);
						    	var id=blocktype>>4;
						    	var meta=blocktype&0xF;
						    	
						    	chunk[y][z][x]=[id, meta];
						    
						    	cursor+=2;
					    	}
				    	}
			    	}
			    	
			    	*/
			    
			    	var slice=chunkdata.slice(cursor, cursor+sizeOfChunk);
			    	cursor+=sizeOfChunk;
			    	scog.setChunk(cx,cy,cz, slice);
			    
			    }else{    	
			    	scog.setChunk(cx,cy,cz, null);
			    }
				
			
			}
			
			for(var cybl=0;cybl<16;cybl++) {
				if (chunkmeta.bitMap & (1 << cybl)) {
					
					//TODO: something with lights
			    	blocklights=chunkdata.slice(cursor, cursor+2048);
			    	cursor+=2048;
			    	//scog.setLight(cx,cy,cz, ...);
					
				}
			}
			
			if(skylight){
			for(var cysl=0;cysl<16;cysl++) {
				if (chunkmeta.bitMap & (1 << cysl)) {
					
			    	//TODO: something with skylights
			    	
		    		skylights=chunkdata.slice(cursor, cursor+2048);
			    	cursor+=2048;
			    	
			    	//scog.setSkylight(cx,cy,cz, ...);
		    	
				
				}
			}
			}
			
			
			
			if(continuous){
				
				//TODO: something with biomes
	    		biomes=chunkdata.slice(cursor, cursor+256);
		    	cursor+=256;
		    	
		    	//scog.setBiome(cx,/*cy,*/cz, ...);
	    	}
			
		});

		
	});

	client.on('explosion',function(data){
		//console.log('explosion: '+JSON.stringify(data));
	});
	
	client.on('world_event',function(data){
		//console.log('world_event: '+JSON.stringify(data));
	});
	
	client.on('named_sound_effect',function(data){
		//console.log('named_sound_effect: '+JSON.stringify(data));
	});
	
	client.on('world_particles',function(data){
		//console.log('world_particles: '+JSON.stringify(data));
	});
	
	client.on('spawn_entity_weather',function(data){
		//console.log('spawn_entity_weather: '+JSON.stringify(data));
	});
	
	return scog;
	
}

var events=require('events');
function SpatialCognizance(){
	events.EventEmitter.call(this); 

	
}

SpatialCognizance.prototype.__proto__ = events.EventEmitter.prototype;


SpatialCognizance.prototype.calcChunk=function(p){

	var pf=positionToBlockCoord(p);
	return {x:Math.floor(pf.x/16), y:Math.floor(pf.y/16), z:Math.floor(pf.z/16)};
	
};

SpatialCognizance.prototype.calcCursor=function(o){
	return (o.y*16*16+o.z*16+o.x)*2;
}

SpatialCognizance.prototype.calcBlockFromData=function(o, chunk){
	var me=this;
	var cursor=me.calcCursor(o);
	var blocktype=chunk.readUInt16LE(cursor);
	var id=blocktype>>4;
	var meta=blocktype&0xF;
	return {id:id, meta:meta};
}

SpatialCognizance.prototype.writeDataFromBlock=function(o, block,  chunk){
	var me=this;
	var cursor=me.calcCursor(o);
	chunk.writeUInt16BE(me.calcDataFromBlock(block), cursor);
}

SpatialCognizance.prototype.calcDataFromBlock=function(block){
	return (block.id<<4)+(block.meta&0xF);
}

SpatialCognizance.prototype.calcOffset=function(p){
	
	var me=this;
	var pf=positionToBlockCoord(p);
	var c=me.calcChunk(p);
	
	return {x:pf.x-(c.x*16), y:pf.y-(c.y*16), z:pf.z-(c.z*16)};
	
};




//returns true if p1 is one of the 26 blocks around p0 also returns true if isEqualTo 
SpatialCognizance.prototype.isNextTo=function(p0, p1, ignoreY){

	var b0=positionToBlockCoord(p0);
	var b1=positionToBlockCoord(p1);
	
	if(Math.abs(b1.x-b0.x)>1)return false;
	if(Math.abs(b1.z-b0.z)>1)return false;
	
	if(!ignoreY){
		if(Math.abs(b1.y-b0.y)>1)return false;
	}
	return true;
};

SpatialCognizance.prototype.isEqualTo=function(p0, p1, ignoreY){

	var b0=positionToBlockCoord(p0);
	var b1=positionToBlockCoord(p1);
	
	if(Math.abs(b1.x-b0.x)>0)return false;
	if(Math.abs(b1.z-b0.z)>0)return false;
	
	if(!ignoreY){
		if(Math.abs(b1.y-b0.y)>0)return false;
	}
	return true;
};
SpatialCognizance.prototype.floorPositionsAlongWidePath=function(r, p0, p1){
	var me=this;
	if(r>0.7){
		throw new Exception('path radius is too big: '+r+', max=0.7'); //worst case, if slope = 1, then max r = Math.sqrt(2)/2 
	}
	
	
	var tangents=spatial.path2D.contraintPaths(r, p0, p1);
	//console.log('Contraint Lines: '+JSON.stringify(tangents));
	
	
	var coords=me.positionListUnion(
			//me.scog.floorPositionsAlongPath(s, p), 
			me.floorPositionsAlongPath(tangents[0][0], tangents[0][1]), 
			me.floorPositionsAlongPath(tangents[1][0], tangents[1][1])
			);
	
	coords.sort(function(a,b){
		
		var da=Math.sqrt(Math.pow(a.x-p0.x,2)+Math.pow(a.z-p0.z,2));
		var db=Math.sqrt(Math.pow(b.x-p0.x,2)+Math.pow(b.z-p0.z,2));
		
		a.d=da;
		b.d=db;
		
		return da-db;
	});


	return coords;

};
//an array of blocks along path defined by p0, p1, ordered by distance to p0.
SpatialCognizance.prototype.floorPositionsAlongPath=function(p0, p1){
	var me=this;
	
	var dx=p1.x-p0.x;
	var dz=p1.z-p0.z;
	
	var b0=me.findFloor(p0);
	var b1=me.findFloor(p1);
	
	
	
	if(me.isEqualTo(b0, b1, true)){
		return [b0];
	}
	
	//strait line, is also easy
	if(dx==0||dz==0){
		
		var mx=dx==0?0:dx/Math.abs(dx);
		var mz=dz==0?0:dz/Math.abs(dz);
		
		var b=b0;
		var coords=[];
		while(!me.isEqualTo(b, b1, true)){
			
			coords.push(b);
			var bn={x:b.x+mx, y:b.y, z:b.z+mz};
			b=me.findFloor(bn); //move to next by adding 1.0 to either x or z. 
			
		}
		coords.push(b1);
		return coords;
	}
	
	var coords=[];
	var b=b0;
	
	//var limit=10;
	while(!me.isEqualTo(b, b1, true)){
		coords.push(b);
		var p=spatial.path2D.exitsBlockAt(b, p0, p1);
		if(p.x==b.x){
			//exits left
			b=me.findFloor({x:b.x-1, y:b.y, z:b.z});
			
		}else if(p.x==b.x+1){
			
			b=me.findFloor({x:b.x+1, y:b.y, z:b.z});
			
		}else if(p.z==b.z){
			
			b=me.findFloor({x:b.x, y:b.y, z:b.z-1});
			
		}else if(p.z==b.z+1){
			
			b=me.findFloor({x:b.x, y:b.y, z:b.z+1});
			
		}else{
			console.log('Error '+JSON.stringify(b)+' '+JSON.stringify(p));
			break;
			
		}
		
		//if(!(--limit))break;
	}

	return coords;
	
};

SpatialCognizance.prototype.hasBlock=function(p){
	var me=this;
	var c=me.calcChunk(p);
	var chunk=me.getChunk(c.x, c.y, c.z);
	if(chunk===false){
		return false;
	}
	return true;
};

SpatialCognizance.prototype.positionListContains=function(list, p){
	
	
	for(var i=0;i<list.length;i++){
		if(list[i].x==p.x&&list[i].z==p.z&&list[i].y==p.y){
			return true;
		}	
	}
	return false;	
}

SpatialCognizance.prototype.positionListUnion=function(){
	
	var coords=[];
	for(var j=0;j<arguments.length;j++){
		(function(a){
			
			a.forEach(function(b){
				
				for(var i=0;i<coords.length;i++){
					if(coords[i].x==b.x&&coords[i].z==b.z&&coords[i].y==b.y){
						return;
					}
				}
				coords.push(b);
				
			});
			
			
		})(arguments[j]);
		
		
	}

	return coords;

};
SpatialCognizance.prototype.blockAt=function(p){
	var me=this;
	var c=me.calcChunk(p);
	var o=me.calcOffset(p);
	
	var chunk=me.getChunk(c.x, c.y, c.z);
	if(chunk===false){
		console.log(JSON.stringify(['missing chunk', c, o, p]));
		//console.log(new Error().stack);
		return false;
	}
	if(chunk===null){
		console.log(JSON.stringify(['null (air) chunk',c, o, p]));
		//console.log((new Error('')).stack);
		return {id:0, data:0, p:{x:p.x, y:p.y, z:p.z}}; //air
	}

	
	var block=me.calcBlockFromData(o, chunk);
	
	return {id:block.id, data:block.meta, p:{x:p.x, y:p.y, z:p.z}};
	
	//var block=chunk[o.y][o.z][o.x];
	//console.log(JSON.stringify(['block', c, o, p]));
	//return {id:block[0], data:block[1], p:{x:p.x, y:p.y, z:p.z}};
};

/**
 * returns an array of blocks that are within r of p (one block is 1x1x1),
 * currently this assumes r<0.5, and max 4 blocks.
 * 
 * uses a square radius, r defines a square with sides 2r
 * 
 */
SpatialCognizance.prototype.positionListColumnSliceAt=function(p, r){
	var me=this;

	var coords=spatial.grid2D.sliceAt(p,r);
	return spatial.points2D.setDifference(coords,[p]);
	
};
SpatialCognizance.prototype.floorNeighbours=function(p){
	var me=this;
	return me.floorListColumnSliceAt(p, 1);
}
SpatialCognizance.prototype.floorListColumnSliceAt=function(p, r){
	var me=this;
	var coords=[];
	me.positionListColumnSliceAt(p, r).forEach(function(p){
		coords.push(me.findFloor(p));
	});
	return coords;
};


SpatialCognizance.prototype.getChunk=function(x,y,z){
	var me=this;
	if(me._chunks===undefined){
		return false;
	}
	
	if(me._chunks['x'+x]===undefined){
		return false;
	}
	
	if(me._chunks['x'+x]['y'+y]===undefined){
		return false;
	}
	
	if(me._chunks['x'+x]['y'+y]['z'+z]===undefined){
		return false;
	}
	
	return me._chunks['x'+x]['y'+y]['z'+z];
};

SpatialCognizance.prototype.list=function(){
	
	var me=this;
	
	var size=0;
	
	Object.keys(me._chunks).forEach(function(k){
		
		size+=(Object.keys(me._chunks[k]).length);
		
	});
	console.log(size+' chunk colums');
	console.log((size*16)+' chunk colums');
	console.log(size*(Math.pow(16,4))+' total blocks');
	
	
}

SpatialCognizance.prototype.updateBlock=function(p,d){
	var me=this;
	var c=me.calcChunk(p);
	var o=me.calcOffset(p);
	
	
	var chunk=me.getChunk(c.x, c.y, c.z);
	if(chunk===false){
		//throw new Error('missing chunk: '+JSON.stringify([c, o, p]));
		return;
	}
	if(chunk===null){
		//throw new Error('(null) air chunk: '+JSON.stringify([c, o, p]));
		return;
	}
	
	//var last=chunk[o.y][o.z][o.x];
	//chunk[o.y][o.z][o.x]=d;
	me.writeDataFromBlock(o, d, chunk);
	me.emit('block.update', p);

	
}
SpatialCognizance.prototype.setChunk=function(x, y, z, chunk){
	
	var me=this;
	if(me._chunks===undefined){
		me._chunks={};
		me._countChunks=0;
	}
	
	if(me._chunks['x'+x]===undefined){
		me._chunks['x'+x]={};
	}
	
	if(me._chunks['x'+x]['y'+y]===undefined){
		me._chunks['x'+x]['y'+y]={};
	}
	
	me._chunks['x'+x]['y'+y]['z'+z]=chunk;
	me._countChunks++;
	
};

SpatialCognizance.prototype.chunkCount=function(){
	var me=this;
	return me._countChunks||0;
};

SpatialCognizance.prototype.clearChunk=function(x, y, z){
	var me=this;
	if(me._chunks===undefined){
		return;
	}
	
	if(me._chunks['x'+x]===undefined){
		return;
	}
	
	if(me._chunks['x'+x]['y'+y]===undefined){
		return;
	}
	
	if(me._chunks['x'+x]['y'+y]['z'+z]===undefined){
		return;
	}
	
	delete me._chunks['x'+x]['y'+y];
	me._countChunks--;
	
	if(Object.keys(me._chunks['x'+x]['y'+y]).length==0){
		delete me._chunks['x'+x]['y'+y];
	}
	
	if(Object.keys(me._chunks['x'+x]).length==0){
		delete me._chunks['x'+x];
	}
};

SpatialCognizance.prototype.findSolid=function(pos, opts){
	var me=this;
	var p=positionToBlockCoord(pos);
	
	if(!me.hasBlock(p)){
		throw new Error('findSolid() data does not exist (chunk not loaded?) at {x:'+p.x+', y:'+p.y+', x:'+p.z+'}');
	}
	while(!me.blockIsSolid(me.blockAt(p))){
		p={x:p.x, y:p.y-1, z:p.z}
	}

	return {x:p.x,y:p.y,z:p.z};
}


//get the next floor block searching up if their are solid blocks at or within 2 above y, 
//or down if y y+1 and y+2 are air
SpatialCognizance.prototype.findFloor=function(pos, opts){

	// return x, y, z if x, y, z is solid, and 2 block above are
	// air. otherwise increment y and repeat
	var me=this;
	
	
	
	var p=me.findSolid(pos);
	var py=p.y; //remember start
	p.y--; //
	
	//console.log(JSON.stringify(p)+' '+items.idToString(me.blockAt(p)));
	
	
	var c=0;
	var blocks=[null, null, null];
	
	var cursor=function(a){
		var cur=a%3;
		if(cur<0)return 3-cur;
		return cur;
	};
	
	var block=function(a){
		return blocks[cursor(a)];
	};
	
	do{
		
		if(!me.hasBlock(p)){
			throw new Error('findFloor() data does not exist (chunk not loaded?) at {x:'+p.x+', y:'+p.y+', x:'+p.z+'}');
		}
		//console.log(JSON.stringify(p)+' '+items.idToString(me.blockAt(p)));
		
		blocks[cursor(c)]=block(c)===null?me.blockAt(p):block(c);
		blocks[cursor(c+1)]=block(c+1)===null?me.blockAt({x:p.x, y:p.y+1, z:p.z}):block(c+1);
		blocks[cursor(c+2)]=block(c+2)===null?me.blockAt({x:p.x, y:p.y+2, z:p.z}):block(c+2);
		
		
		if(block(c)===false){
			throw new Error('findFloor() block '+p.y+' is false at {x:'+p.x+', x:'+p.z+'}');
		}
		
		
		
		var isAir0=!me.blockIsSolid(block(c));
		var isAir1=!me.blockIsSolid(block(c+1));
		var isAir2=!me.blockIsSolid(block(c+2));
		//console.log(JSON.stringify([items.idToString(block(c)), items.idToString(block(c+1)), items.idToString(block(c+2))]));
		
		if(((!isAir0) && isAir1 && isAir2)){
			// bottom block is not air, but the rest are. a normal use-able floor block at (x,y,z)
			return {x:p.x,y:p.y,z:p.z};
		}
		
		if(isAir0 && isAir1 && isAir2){
			// all three blocks are air go down
			blocks[cursor(c+2)]=null;
			p.y--;
			c--;
			
		}else{
			// one of y+1, or y+2 was solid continue to look up.
			blocks[cursor(c)]=null;
			p.y++;
			c++;
			
			
		}

	
	}while(p.y>=0);
	
	throw new Exception('findFloor() could not find floor: '+py+' to '+p.y+' at {x:'+p.x+', x:'+p.z+'}');
};


SpatialCognizance.prototype.blockIsSolid=function(block){
	
	var me=this;
	var code=items.idToCode(block);
	
	//console.log(code);
	
	switch(code){
	
		case 'minecraft:air':
		case 'minecraft:sapling':
		case 'minecraft:web':
		//case 'minecraft:grass': //oops this is solid it is the same as dirt. just green on top
		case 'minecraft:tallgrass':
		case 'minecraft:yellow_flower':
		case 'minecraft:red_flower':
		case 'minecraft:brown_mushroom':
		case 'minecraft:red_mushroom':
		case 'minecraft:torch':
		case 'minecraft:redstone_wire':
		case 'minecraft:wheat':
		case 'minecraft:standing_sign':
		case 'minecraft:rail':	
		
		case 'minecraft:flowing_water':
		case 'minecraft:water':

		case 'minecraft:wall_sign':
		case 'minecraft:lever':
		case 'minecraft:stone_pressure_plate':

		case 'minecraft:wooden_pressure_plate':
		case 'minecraft:unlit_redstone_torch':
		
		case 'minecraft:redstone_torch':
		case 'minecraft:stone_button':
		case 'minecraft:reeds':
		case 'minecraft:unpowered_repeater':
		case 'minecraft:powered_repeater':
		
		
		case 'minecraft:pumpkin_stem':
		case 'minecraft:melon_stem':
		case 'minecraft:vine':
		
		
		case 'minecraft:nether_wart':
		case 'minecraft:carpet':
		case 'minecraft:double_plant':
			return false;
			break;
		//should check for openness?		
		case 'minecraft:trapdoor':	
		case 'minecraft:fence_gate':
			
		
			
		case 'minecraft:iron_door':
		case 'minecraft:wooden_door':
		case 'minecraft:spruce_door':
		case 'minecraft:birch_door':
		case 'minecraft:jungle_door':
		case 'minecraft:acacia_door':
		case 'minecraft:dark_oak_door':
			
				return !me.doorIsOpen(block)
	
	default:return true;
	
	}

	
};



SpatialCognizance.prototype.doorIsOpen=function(block){
	var me=this;
	
	var code=items.idToCode(block);
	
	switch(code){
	
	case 'minecraft:iron_door':
	case 'minecraft:wooden_door':
	case 'minecraft:spruce_door':
	case 'minecraft:birch_door':
	case 'minecraft:jungle_door':
	case 'minecraft:acacia_door':
	case 'minecraft:dark_oak_door':
		break;
		
	default: throw new Error('not a door '+JSON.stringify(block));
	
	}
	
	var top;
	var bottom;
	
	var above=me.blockAt({x:block.p.x, y:block.p.y+1, z:block.p.z});
	if(items.idToCode(above)==code){
		
		top=above
		bottom=block
		
	}else{
		
		var below=me.blockAt({x:block.p.x, y:block.p.y-1, z:block.p.z})
		if(items.idToCode(below)==code){
			
			top=block;
			bottom=below;
			
		}else{
			throw new Error('invalid door block above/below');
		}
		
	}
	
	if(bottom.data&0x4){
		console.log('door is open');
		return true;
	}
	console.log('door is closed');
	return false;
	
	//process.exit(0);
}


/**
 * returns an array of rows, (odd number) with each row containing x cells, the center row and center cell 
 * will contain the block for pos. 
 */
SpatialCognizance.prototype.floorplan=function(pos, options){
	var me=this;

	var opts={
		size:31
	};
	
	if(opts.size5%2!==1){
		//floorplan needs to have odd size for center
	}
	
	var a=[];//array for rows
	for(var i=0;i<opts.size;i++){
		a.push([]);//init row
	}
	var center=Math.floor(opts.size/2);
	
	var p={x:Math.floor(pos.x), y:Math.floor(pos.y), z:Math.floor(pos.z)};
	p=me.findFloor(p); // center block - player is standing on
	if(p===false){
		throw 'floor unavailable';
	}
	var b=me.blockAt(p);
	//[z][x]
	a[center][center]=b;

	//square radius away
	for(var s=1;s<=center;s++){
		(function(s){
			
			var pc;  // position current
			var pb;   // block current
			var ny;  // neighbor y
			
			
			
			//top left
			//top row
			for(var x=(-s); x<=s-1; x++){
				
				
				ny=a[center-s+1][x==-s?center+x+1:center+x].p.y;
				
				pc=me.findFloor({x:pos.x+x, y:ny, z:pos.z-s}); //use neighbor elevation
				pb=me.blockAt(pc);
				a[center-s][center+x]=pb;
		
			}
			
			//top right
			//right column
			for(var z=(-s); z<=s-1; z++){
				
				
				ny=a[z==-s?center+z+1:center+z][center+s-1].p.y;
				
				pc=me.findFloor({x:pos.x+s, y:ny, z:pos.z+z}); //use neighbor elevation
				pb=me.blockAt(pc);
				a[center+z][center+s]=pb;
		
			}
			
			//bottom right
			//bottom row,  right to left
			for(var x=s; x>=(-s)+1; x--){
				
				ny=a[center+s-1][x==s?center+x-1:center+x].p.y;
				
				pc=me.findFloor({x:pos.x+x, y:ny, z:pos.z+s}); //use neighbor elevation
				pb=me.blockAt(pc);
				
				
				a[center+s][center+x]=pb;		
				//console.log((center+s)+' : '+JSON.stringify(a[center+s]));
			}
			
			//bottom left
			//left column, bottom to top
			for(var z=s; z>=(-s)+1; z--){

				ny=a[z==s?center+z-1:center+z][center-s+1].p.y;
				
				pc=me.findFloor({x:pos.x-s, y:ny, z:pos.z+z}); //use neighbor elevation
				pb=me.blockAt(pc);
				a[center+z][center-s]=pb;
		
			}
			
			
		})(s);
	}

	return a;
	
};

SpatialCognizance.prototype.coordsToFloorplan=function(coords){
	
	var minx=null, minz=null, maxx=null, maxz=null;
	
	coords.forEach(function(b){
		
		if(minx===null||b.x<minx)minx=b.x;
		if(minz===null||b.z<minz)minz=b.z;
		if(maxx===null||b.x>maxx)maxx=b.x;
		if(maxz===null||b.z>maxz)maxz=b.z;
		
	});
	
	var floorplan=[];
	
	
	for(var i=0;i<=maxz-minz;i++){
		floorplan.push([]);
		for(var j=0;j<=maxx-minx;j++){
			floorplan[i].push(null);
		}
	}
	
	//console.log(JSON.stringify(floorplan));
	coords.forEach(function(b){
		//console.log(JSON.stringify([b.z-minz, b.x-minx]));
		floorplan[b.z-minz][b.x-minx]=b;
		
	});
	
	return floorplan;
};

SpatialCognizance.prototype.printFloorplan=function(f, fmt, prnt){
	var me=this;
	
	var log=prnt===undefined?console.log:prnt;
	var format=fmt===undefined?function(b, x, z){
		if(b==null)return '[ ]';
		return '['+(items.idToString(me.blockAt(b))).substring(0,1)+']';
	
	}:fmt;
	
	f.forEach(function(row, z){
		
		var line='';
		
		row.forEach(function(block, x){
			
			line+=format(block, x, z);
			
		});
		
		log(line);
		
	});
	
};




function positionToBlockCoord(p){
	return {x:Math.floor(p.x), y:Math.floor(p.y), z:Math.floor(p.z)};
};


module.exports = {
		
		createSpatialCognizance: createSpatialCognizance
}

