function Morpher3D(camera, scene){
	
	var _joints=[];
	var _oldpos=new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
	var _demo=new THREE.Mesh(
		new THREE.SphereGeometry(10,4,4),
		new THREE.MeshBasicMaterial({color:0xffff00,side:THREE.DoubleSide})
	);
	var _baseRule=1500;	
	var _geo=null;
	
	//刷新关节
	function update(){
		var newPos=new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
		var jointPos=null;
		if(_oldpos.equals(newPos)){return;}
		_oldpos=newPos;
		for(var n=0;n<_joints.length;n++){
			if(_joints[n].added==false){break;}	
			jointPos=new THREE.Vector3(_joints[n].position.x,_joints[n].position.y,_joints[n].position.z);
			_joints[n].scale.x=_joints[n].scale.y=_joints[n].scale.z=_oldpos.distanceTo(jointPos)/_baseRule;
		}	
	}
	
	//关节移动
	function moving(joint){
		var pos=tcMath.Global2Local(joint.position.x,joint.position.y,joint.position.z,_geo);
		_geo.geometry.vertices[joint.index].x=pos[0];
		_geo.geometry.vertices[joint.index].y=pos[1];
		_geo.geometry.vertices[joint.index].z=pos[2];
		_geo.geometry.verticesNeedUpdate=true;
		joint.scale.x=joint.scale.y=joint.scale.z=
			_oldpos.distanceTo(new THREE.Vector3(joint.position.x,joint.position.y,joint.position.z))/_baseRule;
	};
	
	//绑定物体
	function attach(geo){
		if(!geo) return;
		var matrix,vertices,pos,np,camerapos,meshpos;
		release();
		matrix=tcMath.rotateMatrix(geo);
		vertices=geo.geometry.vertices;
		camerapos=new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
		for(var n=0;n<vertices.length;n++){
			pos=tcMath.Local2Global(vertices[n].x,vertices[n].y,vertices[n].z,matrix,geo);	
			meshpos=new THREE.Vector3(pos[0],pos[1],pos[2]);
			np=null;
			if(n==_joints.length){
				np=_demo.clone();
				_joints.push(np);
			}else{
				np=_joints[n];	
			}
			np.index=n;
			np.position.x=pos[0];
			np.position.y=pos[1];
			np.position.z=pos[2];
			np.scale.x=np.scale.y=np.scale.z=meshpos.distanceTo(camerapos)/_baseRule;
			np.added=true;
			scene.add(np);
		}
		_geo=geo;
	}
	//解除绑定
	function detach(){
		release();
		_geo=null;
	}
	//释放控制点
	function release(){
		for(var n=0;n<_joints.length;n++){
			if(_joints[n].added==false){break;}
			scene.remove(_joints[n]);
			_joints[n].added=false;	
		}	
	}
	return {
		update:function(){
			update();
		},
		attach:function(geo){
			attach(geo);
		},
		detach:function(){
			detach();
		},
		moving:function(joint){
			moving(joint);
		},
		setSize:function(value){
			_baseRule=value;
		},
		getJoints:function(){
			return _joints;
		}
	}
}