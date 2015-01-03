/*
 * scrape website minecraft-ids.grahamedgecombe.com for minecraft item id, name, and text-ids
 */

require('http').get("http://minecraft-ids.grahamedgecombe.com/", function(res){  
	
	var htmlTrim=function(str){
		var i=str.indexOf('>'), j=str.indexOf('<');
		return str.substring(i+1, j-i);
	};
	
	res.on('end',function(){
		
		var map=[[],[],[]];
		
		var itemsHtml=page.split('class="id"'); itemsHtml.shift(); //discard prefix
		itemsHtml.forEach(function(iHtml){
			var t=iHtml.split('class="name"');
			var id=htmlTrim(t[0]);
			t=t[1];
			
			var t=t.split('class="text-id"');
			var name=htmlTrim(t[0]);
			var text=htmlTrim(t[1])
			
			if(id.indexOf(':')==-1){
				id+=":0"; //optional... for consistency;
			}
			
			map[0].push(id);
			map[1].push(name);
			map[2].push(text);
			
			//console.log(JSON.stringify([id,name,text]));
			
		});
		
		
		require('fs').writeFile('./itemids.json',JSON.stringify(map));
	});
	
	var page='';
	res.on('data',function(body){ page+=body.toString(); });
	
});
