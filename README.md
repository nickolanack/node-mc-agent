This project is closed. and will disapear.



##Node Minecraft Agent##

*node-minecraft-agent is an artificial-intellegent player for minecraft named 'morpheus'*
*node-minecraft-agent requires the updated minecraft-protocol (npm) updated to work with mc 1.8*


###Description###

This project contains a set of javascript (node) libraries for interacting with a minecraft server through a
player/agent. There are 7 libraries, each of which can be used to retreive information or manipulate the environment 
through the agent. 

- mc-entities.js  keeps track of items players (mobs etc) around the agent
- mc-inventory.js  keeps track of the items held by the agent and provides the agent with the ability to use them
- mc-movement.js  keeps track of the agents current location and provides simple movement abilites but fails, when obstructed and is too lazy to go around the obstruction
- mc-pathfinder.js provides advanced routing algorithms can be used with mc-movement to solve path finding problems
- mc-senses.js tracks environment and player states, such as: health, hunger, time, weather ...
- mc-spatial.js used by movement, and pathfinder, and entities provides information about blocks distances and functions for measuring things ...

- agent.js is basically my working minecraft player 

###My Agent###

```terminal
node agent.js
```

###Code###

```js

//this gets the client connected. 

var mc = require('./node-minecraft-protocol'); //require('./node-minecraft-protocol/sub/folders/to/index.js')
var client=mc.createClient({
		port: 8080,  //this also needs to match server.properties setting: server-port   
		username: 'morpheus',
	});
	
```




```js

client.on('login',function(data){
	var itemMap=require('.client/mc-items.json'); //just an array with id's codes, and names of items
	
	// scog, provides methods for getting spatial information about the world. uses itemMap for 
	// deciding if blocks are doors or air etc..
	var scog=require('.client/mc-spatial.js').createSpatialCognizance(client, itemMap);
	
	// movement will imediately start sending udpates about the client's position. 
	// use movement to walkTo, runTo, jump, crouch....
	var movement=require('.client/mc-movement.js').createMovement(client, scog);
});	
```
	

here is a example of getting the player to stare at you... creepy

```js
//ecog provides methods for interacting with entities, including other players
var ecog=require('./mc-entities.js').createEntityCognizance(client);
ecog.once('detect.player',function(id){
	var last;
	var watch=function(){
		//ecog.watch starts returning position updates for an entity
		ecog.watch(id, function(p){
			//this callback function recieves updated for the entity's position
			if(p){
				movement.lookAtPoint(p);
				last=p;
			}
					
		},function(err){
			//this callback is fired after timeout or if watch failed for somereason.		
			var dist=movement.measureTo(last);
			if(dist<30){
				//watch again for 5 sec
				watch();
			}else{
				//stop watching look straight
				movement.look({pitch:0});
			}
					
		}, 5000); //watch_task=watch for 5 seconds and then... watch_task ...
	};
	watch();
});

```
