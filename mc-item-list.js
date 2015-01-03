var itemMap=require('./itemids.json');


function idToString(itemid, data){
	
	
	if((typeof itemid)=='object'){
		//this is preferred
		return idToString(itemid.id, itemid.data);
	}
	
	
	//ig: itemid='1:1'
	if((typeof itemid)=='string'&&itemid.indexOf(':')>=0){
		var i=itemid.split(':')
		return idToString(i[0],i[1]);
	}
	
	if(data>0){
		var i=itemMap[0].indexOf(itemid+":"+data);

		if(i>=0){
			return itemMap[1][i];
		}
	}
	
	var i=itemMap[0].indexOf(itemid+":0");

	if(i>=0){
		return itemMap[1][i];
	}
	
	return 'unknown ('+itemid+':'+(data||0)+')';
	
};


function stringToId(name){

	var i=itemMap[1].indexOf(name);
	if(i>=0){
		var id=itemMap[0][i];
		parseInt(id.split(':')[0]);
	}
	return -1;
	
};

function idToCode(itemid, data){
	

	if((typeof itemid)=='object'){
		return idToCode(itemid.id, itemid.data);
	}
	
	//ig: itemid='1:1'
	if((typeof itemid)=='string'&&itemid.indexOf(':')>=0){
		var i=itemid.split(':')
		return idToCode(i[0],i[1]);
	}
	
	
	if(data>0){
		var i=itemMap[0].indexOf(itemid+":"+data);

		if(i>=0){
			return itemMap[2][i];
		}
	}

	var i=itemMap[0].indexOf(itemid+":0");

	if(i>=0){
		return itemMap[2][i];
	}
	return 'unknown code('+itemid+':'+(data||0)+')';
	
};


module.exports={
		stringToId:stringToId,
		idToString:idToString,
		idToCode:idToCode,
		items:itemMap
};