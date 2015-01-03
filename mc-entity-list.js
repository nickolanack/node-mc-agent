var mobs=require('./mobs.json');
var objects=require('./objects.json');


function mobIdToString(id){

	
	var i=mobs[0].indexOf(id);

	if(i>=0){
		return mobs[1][i];
	}
	
	return 'unknown mob('+id+')';
	
};



function objectIdToString(id){

	
	var i=objects[0].indexOf(id);

	if(i>=0){
		return objects[1][i];
	}
	
	return 'unknown object('+id+')';
	
};


module.exports={
		mobIdToString:mobIdToString,
		objectIdToString:objectIdToString,
		mobs:mobs,
		objects:objects
};