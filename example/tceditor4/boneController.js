

function boneController(stage3d){
	
	var points=[];
	var mesh=null;
	var point= new THREE.Mesh(
		new THREE.SphereGeometry(10,20,20),
		new THREE.MeshBasicMaterial( { color: 0xfff000,side:THREE.DoubleSide })
	);		
	var scene=stage3d.getScene();	
	
	var added=[];	
		
		
	

	
	function addPoints(){
		if(!mesh || !stage3d){return;}	
		var matrix=tcMath.rotateMatrix(mesh);
		var vertices=mesh.geometry.vertices;
		var index=0;
		added=[];
		for(var n=0;n<vertices.length;n++){
			var pos=tcMath.Local2Global(vertices[n].x,vertices[n].y,vertices[n].z,matrix,mesh);	
			var np=null;
			if(index==points.length){
				np=point.clone();points.push(np);
			}else{
				np=points[index];	
			}
			index++;
			np.index=n;
			np.position.x=pos[0];np.position.y=pos[1];np.position.z=pos[2];
			scene.add(np);
			added.push(np);
			np.tcType="pointCtrl";
		}	
	}
	
	
	function updatePoint(p,q,r,index){
		var pos=tcMath.Global2Local(p,q,r,mesh);	
		mesh.geometry.vertices[index].x=pos[0];
		mesh.geometry.vertices[index].y=pos[1];
		mesh.geometry.vertices[index].z=pos[2];
		mesh.geometry.verticesNeedUpdate=true;
	}
	
	


	return {
		attach:function(geo){mesh=geo;addPoints();},
		getPoints:function(){return added;},
		getGeometry:function(){return mesh;},
		updateGeometry:function(p){
			if(!p|| !mesh || added.length<p.index){return;}
			var index=p.index;
			updatePoint(p.position.x,p.position.y,p.position.z,p.index);
		},
		detach:function(){
			mesh=null;
			for(var n=0;n<added.length;n++){
				scene.remove(added[n]);	
			}
			added=[];
		}
	}
}