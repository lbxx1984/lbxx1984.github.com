// JavaScript Document
function JointsController(camera, scene){
	
	var _points=[];
	var _oldpos=new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
	var _demo=new THREE.Mesh(
		new THREE.SphereGeometry(10,4,4),
		new THREE.MeshBasicMaterial({color:0xfff000,side:THREE.DoubleSide})
	);
	var _baseRule=1000;
	var _onDetach=null;
	var _isWorking=false;
	var _isMoving=false;
	var _geo=null;
	var _joint=null;
	var _jointController=null;
	
	_demo.scale.x=_demo.scale.y=_demo.scale.z=1.5;
	
	//刷新，以控制锚点大小
	function update(fromViewChange){
		if(!_isWorking){return;}
		if(fromViewChange){
			attach(_geo);
			if(_jointController){
				_jointController.detach();
				_jointController.onChange(null);
				_jointController=null;
				_joint=null;
				_isMoving=false;
			}
		}else{
			var newPos=new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
			if(_oldpos.equals(newPos)){return;}
			_oldpos=newPos;
			for(var n=0;n<_points.length;n++){
				if(_points[n].added==false){break;}	
				_points[n].scale.x=_points[n].scale.y=_points[n].scale.z=
				_oldpos.distanceTo(
					new THREE.Vector3(_points[n].position.x,_points[n].position.y,_points[n].position.z)
				)/_baseRule;
			}
		}
	}
	
	//关节移动
	function jointOnChange(){
		var pos=tcMath.Global2Local(_joint.position.x,_joint.position.y,_joint.position.z,_geo);
		_geo.geometry.vertices[_joint.index].x=pos[0];
		_geo.geometry.vertices[_joint.index].y=pos[1];
		_geo.geometry.vertices[_joint.index].z=pos[2];
		_geo.geometry.verticesNeedUpdate=true;
		_joint.scale.x=_joint.scale.y=_joint.scale.z=
		_oldpos.distanceTo(
			new THREE.Vector3(_joint.position.x,_joint.position.y,_joint.position.z)
		)/_baseRule;
	};
	
	
	//释放控制点
	function release(){
		for(var n=0;n<_points.length;n++){
			if(_points[n].added==false){break;}
			scene.remove(_points[n]);
			_points[n].added=false;	
		}	
	}
	
	//解除绑定
	function detach(){
		release();
		_isWorking=false;
		_isMoving=false;
		_geo=null;
		_joint=null;
		if(_jointController){
			_jointController.detach();
			_jointController.onChange(null);
			_jointController=null;
		}
		if(_onDetach!=null){_onDetach();}
	}
	
	//绑定物体
	function attach(geo){
		if(!geo) return;
		release();
		var matrix=tcMath.rotateMatrix(geo);
		var vertices=geo.geometry.vertices;
		for(var n=0;n<vertices.length;n++){
			var pos=tcMath.Local2Global(vertices[n].x,vertices[n].y,vertices[n].z,matrix,geo);	
			var np=null;
			if(n==_points.length){
				np=_demo.clone();
				_points.push(np);
			}else{
				np=_points[n];	
			}
			np.index=n;
			np.position.x=pos[0];
			np.position.y=pos[1];
			np.position.z=pos[2];
			scene.add(np);
			np.added=true;
		}
		_geo=geo;
		_isWorking=true;
	}
	
	return {
		update:function(fromViewChange){
			update(fromViewChange);
		},
		attach:function(geo){
			attach(geo);
		},
		detach:function(){
			detach();
		},

		setSize:function(value){
			_baseRule=value;
		},
		setJointController:function(ctrl,geo){
			_jointController=ctrl;
			_joint=geo;
			_jointController.onChange(jointOnChange);
			_jointController.attach(_joint);
			_jointController.setMode("translate");
			_jointController.setSpace("world");
			_isMoving=true;
		},
		clearJointController:function(){
			_jointController.detach();
			_jointController.onChange(null);
			_jointController=null;
			_joint=null;
			_isMoving=false;
		},
		getJoints:function(){
			return _points;
		},
		isWorking:function(){
			return _isWorking;
		},
		isMoving:function(){
			return _isMoving;
		},
		onDetach:function(func){
			_onDetach=func;
		}
	}
}