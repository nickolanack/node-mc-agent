



module.exports = {
		listen: listen
};


var items=require('./mc-args.js');


function listen(client, args){
	
	var readline = require('readline');
	var name=client.username;

	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

	var commandLine=function(input){
		
		var processed=false;
	
		if(args.movement){
			if(input.indexOf('move ')===0){
				
			
				var arg={};
				var tokens=input.substring(5).split(' ');
				for(var i=0;i<tokens.length;i++){
					(function(s, v){
						if(s==='-x'){
							arg.x=parseFloat(v);
						}
						if(s==='-y'){
							arg.y=parseFloat(v);
						}
						if(s==='-z'){
							arg.z=parseFloat(v);
						}
					})(tokens[i], (tokens.length>(i+1)?tokens[i+1]:null));
					
				}
				
				if(Object.keys(arg).length){
					args.movement.moveToRelative(arg);
				}
				
				processed=true;
			}else if(input.indexOf('moveto ')===0){
				
			
				var arg={};
				var tokens=input.substring(5).split(' ');
				for(var i=0;i<tokens.length;i++){
					(function(s, v){
						if(s==='-x'){
							arg.x=parseFloat(v);
						}
						if(s==='-y'){
							arg.y=parseFloat(v);
						}
						if(s==='-z'){
							arg.z=parseFloat(v);
						}
					})(tokens[i], (tokens.length>(i+1)?tokens[i+1]:null));
					
				}
				
				if(Object.keys(arg).length){
					args.movement.moveTo(arg);
				}
				processed=true;
				
			}else if(input.indexOf('walk ')===0){
				
				var pos=args.movement.position;
				var arg={x:pos.x, y:pos.y, z:pos.z};
				var tokens=input.substring(5).split(' ');
				for(var i=0;i<tokens.length;i++){
					(function(s, v){
						if(s==='-x'){
							arg.x+=parseFloat(v);
						}
						if(s==='-y'){
							arg.y+=parseFloat(v);
						}
						if(s==='-z'){
							arg.z+=parseFloat(v);
						}
					})(tokens[i], (tokens.length>(i+1)?tokens[i+1]:null));
					
				}
				
				if(Object.keys(arg).length){
					console.log('walk to '+JSON.stringify(arg));
					args.movement.walkToward(arg, null, 1000, function(err){
						console.log(JSON.stringify(args.movement.position));
					});
				}
				processed=true;
				
			}else if(input.indexOf('look ')===0){
				
				
				var arg={};
				var tokens=input.substring(5).split(' ');
				for(var i=0;i<tokens.length;i++){
					(function(s, v){
						if(s==='-yaw'){
							arg.yaw=parseFloat(v);
						}
						if(s==='-pitch'){
							arg.pitch=parseFloat(v);
						}
					})(tokens[i], (tokens.length>(i+1)?tokens[i+1]:null));
					
				}
				
				if(Object.keys(arg).length){
					args.movement.look(arg);
				}
				processed=true;
				
			}else if(input.indexOf('crouch')===0){
				
				args.movement.crouch();
				processed=true;
				
			}else if(input.indexOf('stand')===0){
				
				args.movement.stand();
				processed=true;
				
			}else if(input.indexOf('jump')===0){
				
				args.movement.jump();
				processed=true;
				
			}else if(input.indexOf('position')===0){
				
				console.log(JSON.stringify(args.movement.position));	
				processed=true;
				
			}
			
		}
		
		if(args.inventory){
			if(input.indexOf('inventory count ')===0){
				
				var item=parseInt(input.substring(16));
				console.log(args.inventory.count(item));
				processed=true;
			}else if(input.indexOf('inventory discard ')===0){
				
				var item=parseInt(input.substring(18));
				args.inventory.discard(item);
				processed=true;
				
			}else if(input==='inventory list'){

				args.inventory.listItems(function(v,k){
					
					return items.idToString(v.id, v.itemDamage)+" "+v.itemCount;
					//return v.id+" "+items.idToString(v.id);
					
				}).forEach(function(i){
					console.log(i);
				});
				processed=true;
			}else if(input==='inventory slots'){

				args.inventory.listItems(function(v,k){
					
					return JSON.stringify(v);
					//return v.id+" "+items.idToString(v.id);
					
				}).forEach(function(i){
					console.log(i);
				});
				processed=true;
			}else if(input==='inventory armor'){
				
				args.inventory.listItems(function(v,k){
					if(([5,6,7,8]).indexOf(k)>=0){
						return items.idToString(v.id, v.itemDamage)+" "+v.itemCount;
					}
					return null;
				}).forEach(function(i){
					console.log(i);
				});
				processed=true;
			}else if(input==='inventory armor'||input==='inventory all armor'){
				
				args.inventory.listItems(function(v,k){
					if(input==='inventory all armor'||([5,6,7,8]).indexOf(k)>=0){
						var string=items.idToString(v.id, v.itemDamage);
						if(string.indexOf('Chestplate')>=0||string.indexOf('Boots')>=0||string.indexOf('Leggings')>=0||string.indexOf('Helmet')>=0){
							return string;
						}
					}
					return null;
				}).forEach(function(i){
					console.log(i);
				});
				processed=true;
			}else if(input==='inventory weapons'||input==='inventory all weapons'){
				
				args.inventory.listItems(function(v,k){
					if(input==='inventory all weapons'||([36, 37, 38, 39, 40, 41, 42, 43, 44]).indexOf(k)>=0){
						var string=items.idToString(v.id, v.itemDamage);
						if(string.indexOf('Sword')>=0){
							return string;
						}
						if(string.indexOf('Bow')>=0){
							var a=args.inventory.count(262);
							string+=' ('+a+' Arrow'+(a==1?'':'s')+')';
							return string;
						}
					}
					return null;
				}).forEach(function(i){
					console.log(i);
				});
				
				
				
				processed=true;
			}else if(input==='inventory slot'){
				var slot=args.inventory.heldSlot();
				console.log('held slot: '+slot+' ('+(slot-36)+')');
				processed=true;
				
			}else if(input==='inventory item'){
				//display currently active item
				var item=args.inventory.itemAt(args.inventory.heldSlot());
				if(item!==null){
					console.log(items.idToString(item.id, item.itemDamage)+" "+item.itemCount);
					
				}else{
					console.log('empty');
				}
				processed=true;
			}else if(input==='inventory drop'){
				//drop one of what is currenlty held
				args.inventory.drop();
				processed=true;
				
			}else if(input==='inventory dropstack'){
				//drop all of what is currenlty held
				args.inventory.dropStack();
				processed=true;
				
			}else if(input.indexOf('inventory use ')===0){
				
				var slot=parseInt(input.substring(14));
				args.inventory.useSlot(slot);
				commandLine('inventory item');
				processed=true;
				
			}else if(input.indexOf('inventory swap ')===0){
				var args=input.substring(14).split(' ');
					
				var slota=parseInt(args[0]);
				var slotb=parseInt(args[1]);
	
				args.inventory.swap(slota, slotb, function(){
					
				});
				processed=true;
				
			}else if(input.indexOf('inventory autoequip')===0){
				args.inventory.autoequip();
				processed=true;
			}
			
		}
		
		if(args.spatial){
			if(input==='spatial count chunks'){
				var c=args.spatial.chunkCount();
				console.log(c+' chunk'+(c==1?'':'s'));
				processed=true;
			}else if(args.movement&&(input==='spatial floorplan'||input==='spatial floorplan -y')){
				
				require('colors');
				
				var p=args.movement.position;
				
				var rows=args.spatial.floorplan({x:p.x, y:p.y, z:p.z});
					
				var names=[];			
				var center=Math.floor(rows.length/2);
				rows.forEach(function(row, z){
					var s='';
					for(var x=0;x<rows.length;x++){
						(function(block, x){
							
							var name=args.spatial.idToString(block);
							
							
							if(block===undefined){
								s+='[ ]';
							}else{
								
								var sc='['+name.substring(0,1)+']';
								if(input==='spatial floorplan -y'){
									sc='['+block.p.y+']';
								}
								if(z==x&&z==center){
									sc=sc.red;
								}else{
									if(name=='Dirt')sc='['+('D'.green)+']';
									if(name=='Grass')sc=sc.bgGreen;
									if(name=='Stone')sc=sc.grey;
									if(name=='Still Water')sc=sc.cyan;
									if(name=='Sand')sc=sc.yellow;
									if(name.indexOf('Leaves')>=0){
										if(input==='spatial floorplan -y'){
											sc='['+(block.p.y+'').green+']';
										}else{
											sc='['+('#'.green)+']';
										}
									}
								}
								s+=sc;
								if(names.indexOf(name)==-1){
									names.push(name);
								}
							}		
						})(row[x], x);
					
					}
					console.log(s);
				});
				console.log(JSON.stringify(names));
				console.log(JSON.stringify(rows[center][center]));
				
				processed=true;
			}else if(args.movement&&input==='spatial floor'){
				
				var p=args.movement.position;
				console.log('find floor at: '+JSON.stringify(p));
				
				args.movement.currentFloorPositions().forEach(function(floor){
					
					//var floor=args.spatial.findFloor(p);
					var block=args.spatial.blockAt(floor);
					console.log(JSON.stringify(block)+' '+items.idToString(block));
					
					
				});
				
				processed=true;
				
			}else if(args.movement&&input==='spatial chunk'){
				
				var p=args.movement.position;
				
				console.log("chunk: "+JSON.stringify(args.spatial.calcChunk(p))+' offset: '+JSON.stringify(args.spatial.calcOffset(p)));
				
				processed=true;
				
			}else if(input.indexOf('spatial blockat ')===0){
				
			
				var arg={};
				var tokens=input.substring(16).split(' ');
				for(var i=0;i<tokens.length;i++){
					(function(s, v){
						if(s==='-x'){
							arg.x=parseFloat(v);
						}
						if(s==='-y'){
							arg.y=parseFloat(v);
						}
						if(s==='-z'){
							arg.z=parseFloat(v);
						}
					})(tokens[i], (tokens.length>(i+1)?tokens[i+1]:null));
					
				}
				
				if(Object.keys(arg).length==3){
					var b=args.spatial.blockAt(arg);
					console.log(JSON.stringify(b)+' '+items.idToString(b));
				}
				processed=true;
				
			}else if(input.indexOf('spatial block')===0){
				

				var p=args.movement.position;
				
				var arg={x:p.x, y:p.y, z:p.z};
				var tokens=input.substring(13).split(' ');
				for(var i=0;i<tokens.length;i++){
					(function(s, v){
						if(s==='-x'){
							arg.x+=parseFloat(v);
						}
						if(s==='-y'){
							arg.y+=parseFloat(v);
						}
						if(s==='-z'){
							arg.z+=parseFloat(v);
						}
					})(tokens[i], (tokens.length>(i+1)?tokens[i+1]:null));
					
				}
				
				if(Object.keys(arg).length==3){
					var b=args.spatial.blockAt(arg);
					console.log(JSON.stringify(b)+' '+items.idToString(b));
				}
				processed=true;
				
			}
			
		}
		
	
		
		if(!processed){
			console.log('unknown command: '+input);	
		}
		rl.question(name+":",commandLine);
	};
	rl.question(name+":",commandLine);
}

