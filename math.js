

//calculate the world position where a path (p0 to p1) intersect (exits) b0
function path2DExitsBlockAt(b0, p0, p1){
	var fn=path2DFunctions(p0, p1);

	if(fn.dx<0){
		return path2DEntersBlockAt(b0, p1, p0);
		
	}
	
	//now dx always positive
	if(fn.dx==0){
		if(p1.z-p0.z>0){
		
			return {x:p0.x, y:b0.y, z:b0.z+1};
		}
	
		return {x:p0.x, y:b0.y, z:b0.z};
	}

	if(fn.dz==0){
		
		return {x:b0.x+1, y:b0.y, z:p0.z};
	
	}

	var z=fn.fx(b0.x+1);
	if(z<b0.z){
	
		return {x:fn.fz(b0.z), y:b0.y, z:b0.z};
		
	}else if(z>b0.z+1){

		return {x:fn.fz(b0.z+1), y:b0.y, z:b0.z+1};
	}else{
		
		return {x:b0.x+1, y:b0.y, z:z};
	}
	
};

//calculate the world position where a path (p0 to p1) intersect (enters) b0
//always returns the y value in b0
function path2DEntersBlockAt(b0, p0, p1){

	
	var fn=path2DFunctions(p0, p1);
	
	if(fn.dx<0){
		return path2DExitsBlockAt(b0, p1, p0);
	}
	
	//now dx always positive so that the enter position can only be in top left or bottom
	
	
	
	if(fn.dx==0){
		//purely verticle (pretending z is vertical axis)
		return {x:p0.x, y:b0.y, z:b0.z+(p1.z-p0.z>0?0:1)};

	}

	if(fn.dz==0){
		//purely horizontal (pretending x is horizontal axis)
		return {x:b0.x, y:b0.y, z:p0.z};
	}
	
	var z=fn.fx(b0.x); // m*b0.x+b;
	if(z<b0.z){
		//enters from below
		return {x:fn.fz(b0.z), y:b0.y, z:b0.z};	
	}else if(z>b0.z+1){
		//enters from above
		return {x:fn.fz(b0.z+1), y:b0.y, z:b0.z+1};
	}else{
		//enters from left
		return {x:b0.x, y:b0.y, z:z};
	}
	
};

//returns the Point x,z (y is ingored, set to b0.y) which is the center point of the path entering and exiting
function path2DIntersectsBlockAt(b0, p0, p1){
	
	var i0=path2DEntersBlockAt(b0, p0, p1);
	var i1=path2DExitsBlockAt(b0, p0, p1);
	
	return {x:i0.x+(i1.x-i0.x)/2, y:b0.y, z:i0.z+(i1.z-i0.z)/2};
}

/*
 * returns and object with:
 * fx a function that takes x and produces z  //not returned if vertical line
 * fz a function that takes z and produces x //not returned if horizontal line
 * 
 *	//note: the argument to fx is ignored if horizontal line
 *	//note: the argument to fz is ignored if verticle line
 * 
 * dx p1.x-p0.x
 * dz p1.z-p0.z
 * slope dz/dx //not returned if horizontal or vertical line
 * offset fx(p0.x) //not returned if horizontal or vertical line
 * 
 */
function path2DFunctions(p0, p1){
	
	if(p0.fx||p0.fz)return p0; //pass though;	


	if(p0.x==p1.z&&p0.z==p1.z)throw new Exception('path2DFunctions Expects two distinct points p0, p1');
	
	var dx=p1.x-p0.x;
	var dz=p1.z-p0.z;
	
	if(dx==0){
		var x=p0.x;
		
		var theta=dz>0?Math.PI/2:-Math.PI/2;
		
		return {
			//there is no fx, ie: division by 0 calculating slope
			fz:function(){
				return x;
			},
			dx:dx,
			dz:dz,
			theta:theta
		};
	}
	
	
	if(dz==0){
		var z=p0.z;
		var theta=dx>0?0:-Math.PI;
		return {
			//there is no fy ie: division by 0 calculating fz, slope (m) = 0, and x=(z-b)/m 
			fx:function(x){
				return z;
			},
			dx:dx,
			dz:dz,
			theta:theta
		};
	}
	
	
	
	var m=dz/dx;
	var b=p0.z-m*p0.x;
	
	var theta=Math.atan(m);
	
	return {
		fx:function(x){
			return m*x+b;
		}, 
		fz:function(z){
			return (z-b)/m;
		},
		dx:dx,
		dz:dz,
		slope:m,
		offset:b,
		theta:theta
	};
	
};


function path2DDistanceAtPoint(p, p0, p1){
	//don't need p1
	return Math.sqrt(Math.pow(p.x-p0.x,2)+Math.pow(p.z-p0.z,2));
};


function path2DFractionAtPoint(p, p0, p1){
	return path2DDistanceAtPoint(p, p0, p1)/path2DDistance(p0,p1);
};

function path2DFractionAtDistance(d, p0, p1){
	return d/path2DDistance(p0,p1);
};

function path2DPointAtFraction(f, p0, p1){
	var dx=p1.x-p0.x;
	var dz=p1.z-p0.z;
	
	return {x:p0.x+f*dx, y:p0.y, z:p0.z+f*dz};
	
};

function path2DPointAtDistance(d, p0, p1){
	return path2DPointAtFraction(path2DFractionAtDistance(d, p0,p1) ,p0, p1);
};

function path2DDistance(p0, p1){
	return Math.sqrt(Math.pow(p1.x-p0.x,2)+Math.pow(p1.z-p0.z,2));
};



/*
 * not used
function chunkToPosition(chunk, offset){
	
	return {x:chunk.x*16 + offset.x, y:chunk.y*16 + offset.y, z:chunk.z*16 + offset.z};
	
};
*/

/*
 * returns an array with 2 arrays , [[p00, p01], [p10, p11]] with each of the two array define start end points for tangential paths 
 * around p0, p1 constrain paths can be used to detect boundary colisions that would be unnoticed by a single path.
 * r defines the tangential distance from [p0,p1] to each of the two parrallel lines
 */
function path2DContraintPaths(r, p0, p1){
	var fn=path2DFunctions(p0, p1);
	if(fn.dx==0){
		return [
		        [{x:p0.x, y:p0.y, z:p0.z-r},{x:p1.x, y:p1.y, z:p1.z-r}], 
		        [{x:p0.x, y:p0.y, z:p0.z+r},{x:p1.x, y:p1.y, z:p1.z+r}]
		        ];
	}
	
	if(fn.dz==0){
		return [
		        [{x:p0.x-r, y:p0.y, z:p0.z},{x:p1.x-r, y:p1.y, z:p1.z}], 
		        [{x:p0.x+r, y:p0.y, z:p0.z},{x:p1.x+r, y:p1.y, z:p1.z}]
		        ];
	}
	
	if(fn.dx<0){
		var pnts=path2DContraintPaths(r, p1, p0);
		return [[pnts[0][1], pnts[0][0]], [pnts[1][1],pnts[1][0]]]; //swap start and end points for each
	}
	
	
	var theta=Math.atan(fn.slope);
	var x=r*Math.sin(theta);
	var z=r*Math.cos(theta);
	
	return [
	        	[{x:p0.x+x, y:p0.y, z:p0.z-z},{x:p1.x+x, y:p1.y, z:p1.z-z}], 
	        	[{x:p0.x-x, y:p0.y, z:p0.z+z},{x:p1.x-x, y:p1.y, z:p1.z+z}]
	       ];
	
	
}


/*
 * returns true if the point is on the path within 0.001
 * note: path extends beyond p0 and p1
 */
function path2DContainsPoint(p, p0, p1){
	
	var fn=path2DFunctions(p0, p1);
	if(fn.fx){
		if(Math.round((fn.fx(p.x)-p.z)*1000)==0)return true;
	}
	
	if(fn.fz){
		if(Math.round((fn.fz(p.z)-p.z)*1000)==0)return true;
	}
	throw new Exception('fn did not contain one of fx, or fz');
};

function path2DContainsPointInBounds(p, p0, p1){
	
	if(path2DContainsPoint(p, p0, p1)){
		if((p.x>=p0.x&&p.x<=p1.x)||(p.x>=p1.x&&p.x<=p0.x)){
			if((p.z>=p0.z&&p.z<=p1.z)||(p.z>=p1.z&&p.z<=p0.z)){
				return true;
			}
		}
	}
	return false;
};

	


function path2DPathsAreParallel(pth0, pth1){

	var fn0=path2DFunctions(pth0[0], pth0[1]);	
	var fn1=path2DFunctions(pth1[0], pth1[1]);	

	if(Math.round((fn0.slope-fn1.slope)*1000)==0)return true
	return false;

}

function path2DPathsIntersectAt(pth0, pth1){

	var fn0=path2DFunctions(pth0[0], pth0[1]);	
	var fn1=path2DFunctions(pth1[0], pth1[1]);	

	if(path2DPathsAreParallel(fn0, fn1)){
		return false;
	}

	if(fn0.slope!==undefined&&fn1.slope!==undefined){
	
		//y1=m1x+b1
		//y2=m2x+b2

		//m1x+b1=m2x+b2

		//m1x-m2x=b2-b1
		//x(m1-m2)=b2-b1
		//x=(b2-b1)/(m1-m2)

		var x=(fn1.offset-fn0.offset)/(fn0.slope-fn1.slope);
		var z=fn0.fx(x);

		return {x:x, z:z};

	}

	var x=null;
	var z=null;
	if(fn0.fz===undefined){
		z=fn0.fx();
	}
	if(fn0.fx===undefined){
		x=fn0.fz();
	}
	if(fn1.fz===undefined){
		z=fn1.fx();
	}
	if(fn1.fx===undefined){
		x=fn1.fz();
	}

	return {x:x, z:z};
}

function point3DMeasure(p0, p1){
	
	return Math.sqrt(Math.pow(p1.x-p0.x,2) + Math.pow(p1.y-p0.y,2) + Math.pow(p1.z-p0.z,2));
	
}

module.exports = {
		
		path3D:{
			
			measure:point3DMeasure,
			
		},
		path2D:{
			
			entersBlockAt:path2DEntersBlockAt,
			exitsBlockAt:path2DExitsBlockAt,
			intersectsBlockAt:path2DIntersectsBlockAt,
			distanceAtPoint:path2DDistanceAtPoint,
			fractionAtPoint:path2DFractionAtPoint,
			fractionAtDistance:path2DFractionAtDistance,
			pointAtFraction:path2DPointAtFraction,
			pointAtDistance:path2DPointAtDistance,
			distance:path2DDistance,
			contraintPaths:path2DContraintPaths,
			functions:path2DFunctions,
			pathsAreParallel:path2DPathsAreParallel
			
		}
	
			
			
			
		
		
				
};