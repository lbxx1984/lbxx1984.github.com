(function($){

	$.fn.stage3D = function(param){
		
		var _this=this;		
		var _cameraRadius=param.cameraRadius||1500; 
		var _cameraAngleA=param.cameraAngleA||40;  			
		var _cameraAngleB=param.cameraAngleB||45; 
		var _cameraLookAt=param.cameraLookAt||{x:0,y:0,z:0};
		var _cameraMoveSpeed=2;
		var _gridSize=5000;
		var _gridShow=true;
		var _cameraController=null;
		var _stats=null;
		var _mouse2d=new THREE.Vector3();
		var _mouse3d=new THREE.Vector3();
		var _gridLocked=true;
		var _children=[];
		var _display=true;
		
		var _container = _this[0];
		var _camera = new THREE.PerspectiveCamera( 60, param.width/param.height, 1, 20000 );	
		var _scene = new THREE.Scene();
		var _renderer = new THREE.WebGLRenderer( { antialias: true } );
		var _axis=new THREE.AxisHelper( 200 );
		var _projector = new THREE.Projector();
		var _bg=new THREE.Object3D();
		var _grid=grid();
		var _geometryController = new THREE.TransformControls(_camera,_renderer.domElement);
		var _ctrlPointController = new THREE.TransformControls(_camera,_renderer.domElement);
				
		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 0, 1, 0 );
		_scene.add( light );
		

		if(param.showAxis){_scene.add(_axis);}
		if(param.showGrid){_scene.add(_grid);}
		
		
		
		_this.addClass("stage3d").css({left:"0px",top:"0px",width:param.width+"px",height:param.height+"px"})
		_camera.position=getCameraPos();
		_scene.add(_bg);
		_renderer.setClearColor(param.clearColor);
		_renderer.setSize(param.width,param.height);
		_axis.position.set( 0,0,0 );
		_plane= new THREE.Mesh(new THREE.PlaneGeometry(10000,10000,1,1),new THREE.MeshLambertMaterial({ambient:0xbbbbbb,side:THREE.DoubleSide}));
		_plane.position.set( 0, 0, 0 );_plane.rotation.x=Math.PI*0.5;_plane.visible=false;
		_bg.add(_plane);
		_container.appendChild( _renderer.domElement );
		_container.onmousewheel=function(event){cameraZoom(event.wheelDelta);};
		_ctrlPointController.setMode( "translate" );
		_ctrlPointController.setSpace( "world" );
		
	
	
	
		_this
		.bind("mousemove",function(e){
			var x=( e.clientX / window.innerWidth) * 2 - 1;
			var y=-( e.clientY / window.innerHeight) * 2 + 1;
			if(x==_mouse2d.x && y==_mouse2d.y){return;}
			_mouse2d.x=x;
			_mouse2d.y=y;
			getMouse3D();
			_this.trigger("mouse3Dchange",[_mouse3d]);
		})
		.bind("contextmenu",function(e){ 
 			return false; 
		});

		_geometryController.onMouseRightButtonClick=function(){
			_geometryController.detach();
			_scene.remove(_geometryController);		
		}
		
		_ctrlPointController.onMouseRightButtonClick=function(){
			_ctrlPointController.detach();
			_scene.remove(_ctrlPointController);		
		}
		
		
		animate();
			
		
		function animate(){
			requestAnimationFrame( animate );
			if(!_display){return;}
			_camera.lookAt(_cameraLookAt);
			_renderer.render(_scene,_camera);
			_geometryController.update();
			if(_cameraController){_cameraController.animate();}
			if(_stats){_stats.update();}
		}
		
		
		function getMouse3D(){
			var raycaster=_projector.pickingRay( _mouse2d.clone(), _camera );
			var intersects=raycaster.intersectObjects([_plane]);
			var intersector=null;
			var voxelPosition = new THREE.Vector3();
			var tmpVec = new THREE.Vector3();
			var normalMatrix = new THREE.Matrix3();
			if(intersects.length>0){
				intersector=intersects[0];
				normalMatrix.getNormalMatrix( intersector.object.matrixWorld );
				tmpVec.applyMatrix3( normalMatrix ).normalize();
				voxelPosition.addVectors( intersector.point,tmpVec);
				if(Math.abs(voxelPosition.x)<5){voxelPosition.x=0;}
				if(Math.abs(voxelPosition.y)<5){voxelPosition.y=0;}
				if(Math.abs(voxelPosition.z)<5){voxelPosition.z=0;}
				_mouse3d=voxelPosition.clone();
			}
		}
		
		function cameraZoom(value){
			_cameraRadius+=-0.2*_cameraRadius*value*_cameraMoveSpeed/param.width;
			if(_cameraRadius<50){_cameraRadius=50;}
			if(_cameraRadius>5000){_cameraRadius=5000;}
			_camera.position=getCameraPos();	
		}
		
		function getCameraPos(){
			var y=_cameraRadius*Math.sin(Math.PI*_cameraAngleA/180);
			var x=_cameraRadius*Math.cos(Math.PI*_cameraAngleA/180)*Math.cos(Math.PI*_cameraAngleB/180);
			var z=_cameraRadius*Math.cos(Math.PI*_cameraAngleA/180)*Math.sin(Math.PI*_cameraAngleB/180);
			if(Math.abs(_cameraAngleA)<5){
				_bg.rotation.z=_grid.rotation.z=Math.PI*0.5-Math.PI*_cameraAngleB/180;
				_bg.rotation.x=_grid.rotation.x=Math.PI*1.5;
				_gridLocked=false;
			}else{
				_bg.rotation.z=_grid.rotation.z=0;
				_bg.rotation.x=_grid.rotation.x=0;
				_gridLocked=true;
			}
			return {x:x+_cameraLookAt.x,y:y+_cameraLookAt.y,z:z+_cameraLookAt.z};
		}
		
		function grid(){
			
			var rotation={x:0,y:0,z:0}
			if(_grid){
				rotation.x=_grid.rotation.x;
				rotation.y=_grid.rotation.y;
				rotation.z=_grid.rotation.z;
				_scene.remove(_grid);
			}
			var mesh;
			var geometry = new THREE.Geometry();
			var step = 50;
			var size=_gridSize;
			for (var i = - size; i <= size; i += step ) {
				geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
				geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );
				geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
				geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
			}
			mesh = new THREE.Line( geometry, new THREE.LineBasicMaterial({color:param.gridColor}));
			mesh.rotation.x=rotation.x;
			mesh.rotation.y=rotation.y;
			mesh.rotation.z=rotation.z;
			mesh.type = THREE.LinePieces;
			return mesh;	
		}
		
		
		
		
		
		
		//外部接口
		_this.display=function(b){_display=b;}
		_this.addGeometry=function(geo){_children.push(geo);_scene.add(geo);}
		_this.children=function(){return _children;}
		
		_this.getGeometryController=function(){return _geometryController;}
		_this.getCtrlPointController=function(){return _ctrlPointController;}
		
		_this.selectGeometry=function(arr){
			var array=arr||_children;
			var raycaster=_projector.pickingRay( _mouse2d.clone(), _camera );
			var intersects=raycaster.intersectObjects(array);
			var intersector=null;
			var voxelPosition = new THREE.Vector3();
			var tmpVec = new THREE.Vector3();
			var normalMatrix = new THREE.Matrix3();
			if(intersects.length>0){
				return intersects[0].object;
			}else{
				return null;	
			}
		}
		_this.resize=function(width,height){
			param.width=width;
			param.height=height;
			_camera.aspect = width/height;
			_camera.updateProjectionMatrix();
			_renderer.setSize(width,height);
			return _this;
		}
		_this.setCamera=function(p){
			if(p==null){return;}
			if(p.a!=null){_cameraAngleA=p.a;}
			if(p.b!=null){_cameraAngleB=p.b;}
			_camera.position=getCameraPos();
		}
		_this.zoomCamara=function(dx){
			if(dx>0){cameraZoom(360);}else{cameraZoom(-360);}
		}
		_this.cameraLookAt=function(dx,dy){
			dx=_cameraRadius*dx*_cameraMoveSpeed*0.2/param.width;
			dy=_cameraRadius*dy*_cameraMoveSpeed*0.2/param.height;
			if(Math.abs(_cameraAngleA)>5){
				_cameraLookAt.x-=Math.sin(Math.PI*_cameraAngleB/180)*dx;
				_cameraLookAt.z+=Math.cos(Math.PI*_cameraAngleB/180)*dx;
				_cameraLookAt.x-=Math.cos(Math.PI*_cameraAngleB/180)*dy*Math.abs(_camera.position.y)/_camera.position.y;
				_cameraLookAt.z-=Math.sin(Math.PI*_cameraAngleB/180)*dy*Math.abs(_camera.position.y)/_camera.position.y;
			}else{
				_cameraLookAt.x-=Math.sin(Math.PI*_cameraAngleB/180)*dx;
				_cameraLookAt.z+=Math.cos(Math.PI*_cameraAngleB/180)*dx;
				_cameraLookAt.y+=dy;
			}
			_bg.position.x=_cameraLookAt.x;
			_bg.position.y=_cameraLookAt.y;
			_bg.position.z=_cameraLookAt.z;
			_camera.position=getCameraPos();	
		}
		_this.setController=function(controller){
			_cameraController=controller;
			controller.addStage(_this);	
			return _this;
		}
		_this.setStats=function(stats){
			_this[0].appendChild(stats.domElement);
			_stats=stats;
			return _this;
		}
		_this.getScene=function(){return _scene;}
		_this.mousePosition=function(){return _mouse3d.clone();}
		_this.gridLocked=function(){return _gridLocked;}
		_this.toggleAxis=function(){
			_gridShow=!_gridShow;
			_grid.visible=_gridShow;
			_axis.visible=_gridShow;
		}
		_this.resizeGrid=function(enlarge){
			if(enlarge==1){_gridSize+=1000;}else{_gridSize-=1000;}
			if(_gridSize>20000){_gridSize=20000;}
			if(_gridSize<1000){_gridSize=1000;}
			_grid=grid();
			if(param.showGrid){_scene.add(_grid);}
		}
		
		
		return _this;
	}
})(jQuery);