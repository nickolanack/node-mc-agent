
module.exports = {
		createEntityCognizance: createEntityCognizance
};

var entities=require('./mc-entity-list.js');


function createEntityCognizance(client){
	
	var ecog=new EntityCognizance();	
	
	
	client.on('named_entity_spawn',function(data){
			ecog.addEntity(data.entityId, {x:data.x, y:data.y, z:data.z, pitch:data.pitch, yaw:data.yaw}, 'player');
	});
	
	client.on('spawn_entity',function(data){
			//ecog.addEntity(data.entityId);
		
		var type=entities.objectIdToString(data.type);
		
		//console.log('spawn_entity: '+type);
		ecog.addEntity(data.entityId, {
			x:data.x, y:data.y, z:data.z, pitch:data.pitch, yaw:data.yaw, 
		}, type.toLowerCase().replace(' ','_'));
	});
	
	client.on('spawn_entity_living',function(data){
		
		var type=entities.mobIdToString(data.type);
		
		//console.log('spawn_entity_living: '+type);
		ecog.addEntity(data.entityId, {
			x:data.x, y:data.y, z:data.z, pitch:data.pitch, yaw:data.yaw, 
			headPitch:data.headPitch,
			vx:data.velocityX, vy:data.velocityY, vz:data.velocityZ
			}, type.toLowerCase().replace(' ','_'));
	});
	
	client.on('entity_velocity',function(data){
		ecog.updateEntityVelocity(data.entityId, { vx:data.velocityX/32.0, vy:data.velocityY/32.0, vz:data.velocityZ/32.0});
	});
	
	
//	client.on('spawn_entity_painting',function(data){
//	}); //don't care
	
	client.on('spawn_entity_experience_orb',function(data){
	});
	
	
	
	client.on('rel_entity_move',function(data){
		ecog.updateEntityPosition(data.entityId, {x:data.dX/32.0, y:data.dY/32.0, z:data.dZ/32.0}, true);
	});
	
	client.on('entity_move_look',function(data){
		ecog.updateEntityPosition(data.entityId, {x:data.dX/32.0, y:data.dY/32.0, z:data.dZ/32.0}, true);
	});
	
	client.on('entity_teleport',function(data){
		ecog.updateEntityPosition(data.entityId, {x:data.x/32.0, y:data.y/32.0, z:data.z/32.0});
		//console.log(JSON.stringify(data));
	});
	
	client.on('entity_destroy',function(data){
		for(var i=0;i<data.count;i++){
			ecog.removeEntity(data.entityIds[i]);
		}
	});
	
	
	ecog.setMortalEnemies(['creeper', 'zombie', 'skeleton', 'spider', 'cave_spider']);
	
	return ecog;
	
}

var events=require('events');
function EntityCognizance(){
	events.EventEmitter.call(this); 
	var me=this;
	
	me._entityIds=[];
	me._entityTraits=[];
	me._entityActions=[];
	me._entityAssets=[];
	me._entityPositions=[];
	me._entityTypes=[];
	me._entityVelocities=[];
	
	
	me._m_enemies=[];
	
}

EntityCognizance.prototype.__proto__ = events.EventEmitter.prototype;

EntityCognizance.prototype.hasEntity=function(id){
	var me=this;
	return (me._idx(id)>=0)?true:false;
};

EntityCognizance.prototype._idx=function(id){
	var me=this;
	return me._entityIds.indexOf(id);
};

EntityCognizance.prototype.entityIs=function(id, traitName){
	//var me=this;

	return false;
};

EntityCognizance.prototype.entityHas=function(id, assetName){
	//var me=this;
};

EntityCognizance.prototype.entityDoes=function(id, actionName){
	//var me=this;
};

EntityCognizance.prototype.addEntity=function(id, position, type){
	var me=this;
	if(me.hasEntity(id)){
		console.log('already has '+id);
	}
	
	me._entityIds.push(id);
	me._entityTraits.push({});
	me._entityActions.push({});
	me._entityAssets.push({});
	me._entityPositions.push(position);
	me._entityTypes.push(type||null);
	me._entityVelocities.push({});
	
	me.emit('detect', id, type);
	
	if(type){
		me.emit('detect.'+type, id);
		
		if(me._m_enemies.indexOf(type)>=0){
			me.emit('detect.enemy', id, type);
		}
		
		
		
		
	}else{
		me.emit('detect.unkown', id, 'unknown');
	}
};


EntityCognizance.prototype.removeEntity=function(id){
	var me=this;
	if(!me.hasEntity(id))return;
	var i=me._idx(id);
	
	var type=me._entityTypes[i];
	
	
	me._entityIds.splice(i,1);
	me._entityTraits.splice(i,1);
	me._entityActions.splice(i,1);
	me._entityAssets.splice(i,1);
	me._entityPositions.splice(i,1);
	me._entityTypes.splice(i,1);
	me._entityVelocities.splice(i,1);
	
	me.emit('lose', id);
	
	if(type){
		me.emit('lose.'+type, id);
	}else{
		me.emit('lose.unkown', id);
	}
};
EntityCognizance.prototype.updateEntityVelocity=function(id, velocity){
	var me=this;
	if(me.hasEntity(id)){
		var i=me._idx(id);
		var last=me._entityVelocities[i];
		var current={
				vx:velocity.vx, 
				vy:velocity.vy, 
				vz:velocity.vz, 
			};
		me._entityVelocities[i]=current;
		if(!(last.x==current.x&&last.y==current.y&&last.z==current.z)){
			me.emit('update.velocity.'+id, {vx:current.vx, vy:current.vy, vz:current.vz}, last);
		}
		
		return last;
	}
	return false;
};

EntityCognizance.prototype.updateEntityPosition=function(id, position, rel){
	var me=this;
	if(me.hasEntity(id)){
		var i=me._idx(id);
		var last=me._entityPositions[i];
		var current=rel?{
				x:last.x+position.x, 
				y:last.y+position.y, 
				z:last.z+position.z, 
				yaw:last.yaw, 
				pitch:last.pitch
			}:{
				x:position.x, 
				y:position.y, 
				z:position.z, 
				yaw:last.yaw, 
				pitch:last.pitch
			};
		me._entityPositions[i]=current;
		if(!(last.x==current.x&&last.y==current.y&&last.z==current.z)){
			me.emit('update.position.'+id, {x:current.x, y:current.y, z:current.z, yaw:current.yaw, pitch:current.pitch}, last);
		}
		
		if(!(last.yaw==current.yaw&&last.pitch==current.pitch)){
			me.emit('update.look.'+id, {x:current.x, y:current.y, z:current.z, yaw:current.yaw, pitch:current.pitch}, last);
		}
		
		return last;
	}
	return false;
};

EntityCognizance.prototype.getEntityPosition=function(id){
	var me=this;
	if(me.hasEntity(id)){
		var p=me._entityPositions[me._idx(id)];
		return {x:p.x, y:p.y, z:p.z, pitch:p.pitch, yaw:p.yaw, };
	}
	return false;
};

/*
 * watch an items position. 
 */
EntityCognizance.prototype.watch=function(id, update, after, time){
	var me=this;
	
	var f=function(pos){
		update(pos);
	};
	me.on('update.position.'+id, f);
	
	setTimeout(function(){
		me.removeListener('update.position.'+id, f);
		after();
	},time);
	update(me.getEntityPosition(id));
	return me;
};

EntityCognizance.prototype.setMortalEnemies=function(e){
	var me=this;
	me._m_enemies=e;
};

