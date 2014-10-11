(function($){

	$.fn.Stage3D = function(param){
		
		//组件和3D物体
		var _this=this;
		var _children={};
		//摄像机参数
		var _cameraRadius=param.cameraRadius||2000; 
		var _cameraAngleA=param.cameraAngleA||40;  			
		var _cameraAngleB=param.cameraAngleB||45; 
		var _cameraLookAt=param.cameraLookAt||{x:0,y:0,z:0};
		var _cameraMoveSpeed=2;
		//舞台参数
		var _display=true;
		var _width=param.width||1000;
		var _height=param.height||800;
		var _clearColor=(param.clearColor==null)?0xffffff:param.clearColor;
		//网格和坐标轴参数
		var _showGrid=(param.showGrid==null)?false:true;
		var _gridColor=(param.gridColor==null)?0xffffff:param.gridColor;
		var _gridSize=2000;
		var _gridLocked=true;
		//鼠标参数
		var _mouse2d=new THREE.Vector3();
		var _mouse3d=new THREE.Vector3();
		//需要传递animate动作的插件
		var _plugin={}
		//自定义事件
		var _event={};	

	
		//3D场景
		var _grid		= grid();
		var _camera 	= new THREE.PerspectiveCamera( 60,_width/_height, 1, 20000 );	
		var _scene 		= new THREE.Scene();
		var _renderer 	= new THREE.WebGLRenderer( { antialias: true } );
		var _axis		= new THREE.AxisHelper( 200 );
		var _projector 	= new THREE.Projector();
		var _bg			= new THREE.Object3D();
		var _plane		= new THREE.Mesh(
							new THREE.PlaneGeometry(10000,10000,1,1),
							new THREE.MeshLambertMaterial({ambient:0xbbbbbb,side:THREE.DoubleSide})
						);
		//
		if(_showGrid){
			_scene.add(_grid);
			_scene.add(_axis);
		}
		_camera.position=getCameraPos();
		_scene.add(_bg);
		_renderer.setClearColor(_clearColor);
		_renderer.setSize(_width,_height);
		_axis.position.set(0,0,0);
		_plane.position.set(0,0,0);
		_plane.rotation.x=Math.PI*0.5;
		_plane.visible=false;
		_bg.add(_plane);
		_this[0].appendChild(_renderer.domElement);
		//
		animate();
		
		
		/***内部处理事件***/
		_this
		.bind("mousemove",function(e){
			var offset=_this.offset();
			_mouse2d.x=((e.clientX-offset.left)/_width)*2-1;
			_mouse2d.y=-((e.clientY-offset.top+document.body.scrollTop)/_height)*2+1;
			var raycaster=_projector.pickingRay( _mouse2d.clone(),_camera);
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
		})
		_this[0].onmousewheel=function(event){
			cameraZoom(event.wheelDelta);
			outputCamera();
			event.stopPropagation();
			return false;
		};	
		
		
		/***辅助函数***/
		//场景渲染
		function animate(){
			requestAnimationFrame(animate);
			if(!_display){return;}
			//渲染内部
			_camera.lookAt(_cameraLookAt);
			_renderer.render(_scene,_camera);
			//渲染插件
			for(var key in _plugin){ _plugin[key].animate();}
		}
		//设置摄像机焦距
		function cameraZoom(value){
			_cameraRadius+=-0.2*_cameraRadius*value*_cameraMoveSpeed/_width;
			if(_cameraRadius<50){_cameraRadius=50;}
			if(_cameraRadius>5000){_cameraRadius=5000;}
			_camera.position=getCameraPos();
		}
		//计算摄像机姿态
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
		//创建辅助网格
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
			mesh = new THREE.Line( geometry, new THREE.LineBasicMaterial({color:_gridColor}));
			mesh.rotation.x=rotation.x;
			mesh.rotation.y=rotation.y;
			mesh.rotation.z=rotation.z;
			mesh.type = THREE.LinePieces;
			return mesh;	
		}

		function outputCamera(){
			if(!_event["onCameraChange"]) return;
			_event["onCameraChange"](
				_camera.position,_cameraLookAt,{r:5000-_cameraRadius,b:5000,a:50}
			);		
		}


		/***外部接口***/
		//////////////////舞台信息接口
		_this.children=function(){return _children;}
		_this.getChild=function(key){return _children[key];}
		_this.getScene=function(){return _scene;}
		_this.getCamera=function(){return _camera;}
		_this.getRenderer=function(){return _renderer;}
		_this.getMousePosition=function(){return _mouse3d.clone();}
		_this.getPlugin=function(key){return _plugin[key];}
		_this.isGridLocked=function(){return _gridLocked;}
		//////////////////物体接口
		_this.addGeometry=function(geo){
			if(_children[geo.id]) return false;
			_children[geo.id]=geo;
			_scene.add(geo);
		}
		_this.removeGeometry=function(geo){
			_scene.remove(geo);
			delete _children[geo.id];
		}
		_this.selectGeometry=function(arr){
			var array=[];
			if(arr instanceof Array){
				array=arr;	
			}else{
				for(var key in _children){
					if(_children[key].visible) array.push(_children[key]);
				}
			}
			if(array.length==0) return null;
			var raycaster=_projector.pickingRay( _mouse2d.clone(), _camera);
			var intersects=raycaster.intersectObjects(array);
			if(intersects.length>0){
				return intersects[0].object;
			}else{
				return null;	
			}
		}
		///////////////////摄像机接口
		_this.setCamera=function(p){
			if(p==null){return;}
			if(p.a!=null){_cameraAngleA=p.a;}
			if(p.b!=null){_cameraAngleB=p.b;}
			_camera.position=getCameraPos();
			outputCamera();	
		}
		_this.zoomCamara=function(dx){
			if(dx>0){cameraZoom(360);}else{cameraZoom(-360);}
			outputCamera();
		}
		_this.zoomTo=function(v){
			_cameraRadius=5000-v;
			if(_cameraRadius<50){_cameraRadius=50;}
			if(_cameraRadius>5000){_cameraRadius=5000;}
			_camera.position=getCameraPos();
			outputCamera();
		}
		_this.cameraLookAt=function(dx,dy){
			dx=_cameraRadius*dx*_cameraMoveSpeed*0.2/_width;
			dy=_cameraRadius*dy*_cameraMoveSpeed*0.2/_height;
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
			outputCamera();
		}
		_this.setRendererColor=function(c){
			_renderer.setClearColor(parseInt(c.substr(1),16));
		}
		_this.toggleAxis=function(){
			_showGrid=!_showGrid;
			_grid.visible=_showGrid;
			_axis.visible=_showGrid;
		}
		_this.setGridColor=function(e){
			_gridColor=parseInt(e.substr(1),16);
			_grid=grid();
			if(_showGrid){_scene.add(_grid);}
		}
		_this.resizeGrid=function(enlarge){
			if(enlarge==1){
				_gridSize=Math.min(_gridSize+1000,20000);
			}else{
				_gridSize=Math.max(_gridSize-1000,1000);
			}
			_grid=grid();
			if(_showGrid){_scene.add(_grid);}
		}
		_this.resize=function(width,height){
			_width=width;
			_height=height;
			_camera.aspect = width/height;
			_camera.updateProjectionMatrix();
			_renderer.setSize(width,height);
		}
		_this.display=function(b){_display=b;}
		//事件接口
		_this.addPlugin=function(key,obj){
			_plugin[key]=obj;	
		}
		_this.removePlugin=function(key){
			delete _plugin[key];	
		}
		_this.addListener=function(type,func){
			_event[type]=func;	
		}
		_this.removeListener=function(type){
			_event[type]=null;	
		}
		return _this;
	}
})(jQuery);