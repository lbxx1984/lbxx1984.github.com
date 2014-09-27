(function($){

	$.fn.CameraController = function(param){
		
		var _this=this;
		var _INTERSECTED =null;
		var _stage=[];
		
		var _cameraRadius=90; 
		var _cameraAngleA=param.cameraAngleA||40;  			
		var _cameraAngleB=param.cameraAngleB||45; 
		var _cameraMoveSpeed=2;	
		var _cameraRotated=false;
		var _cameraLookAt={x:0,y:0,z:0};
		var _tmpMouse=[0,0];
		
		
		var _camera = new THREE.PerspectiveCamera( 60, param.width/param.height, 1, 10000 );		
		var _scene = new THREE.Scene();
		var _renderer=new THREE.CanvasRenderer();
		var _projector = new THREE.Projector();
		var _raycaster = new THREE.Raycaster();
		
		var info=[
			{id:"font",x:20,y:0,z:0,rx:0,ry:0.5,rz:0,a:30,b:30},
			{id:"back",x:-20,y:0,z:0,rx:0,ry:-0.5,rz:0,a:30,b:30},
			{id:"top",x:0,y:20,z:0,rx:-0.5,ry:0,rz:0,a:30,b:30},
			{id:"bottom",x:0,y:-20,z:0,rx:0.5,ry:0,rz:0,a:30,b:30},
			{id:"left",x:0,y:0,z:20,rx:0,ry:0,rz:0,a:30,b:30},
			{id:"right",x:0,y:0,z:-20,rx:0,ry:-1,rz:0,a:30,b:30},
			{id:"font_left_top",x:17.5,y:17.5,z:17.5,rx:0,ry:0,rz:0,a:5,b:5,c:5},
			{id:"font_right_top",x:17.5,y:17.5,z:-17.5,rx:0,ry:0,rz:0,a:5,b:5,c:5},
			{id:"left_top_back",x:-17.5,y:17.5,z:17.5,rx:0,ry:0,rz:0,a:5,b:5,c:5},
			{id:"back_top_right",x:-17.5,y:17.5,z:-17.5,rx:0,ry:0,rz:0,a:5,b:5,c:5},
			{id:"left_font_bottom",x:17.5,y:-17.5,z:17.5,rx:0,ry:0,rz:0,a:5,b:5,c:5},
			{id:"font_right_bottom",x:17.5,y:-17.5,z:-17.5,rx:0,ry:0,rz:0,a:5,b:5,c:5},
			{id:"left_back_bottom",x:-17.5,y:-17.5,z:17.5,rx:0,ry:0,rz:0,a:5,b:5,c:5},
			{id:"right_back_bottom",x:-17.5,y:-17.5,z:-17.5,rx:0,ry:0,rz:0,a:5,b:5,c:5},
			{id:"left_top",x:0,y:17.5,z:17.5,rx:0,ry:0,rz:0,a:30,b:5,c:5},
			{id:"left_bottom",x:0,y:-17.5,z:17.5,rx:0,ry:0,rz:0,a:30,b:5,c:5},
			{id:"top_right",x:0,y:17.5,z:-17.5,rx:0,ry:0,rz:0,a:30,b:5,c:5},
			{id:"bottom_right",x:0,y:-17.5,z:-17.5,rx:0,ry:0,rz:0,a:30,b:5,c:5},
			{id:"top_font",x:17.5,y:17.5,z:0,rx:0,ry:0,rz:0,a:5,b:5,c:30},
			{id:"bottom_font",x:17.5,y:-17.5,z:0,rx:0,ry:0,rz:0,a:5,b:5,c:30},
			{id:"back_bottom",x:-17.5,y:-17.5,z:0,rx:0,ry:0,rz:0,a:5,b:5,c:30},
			{id:"top_back",x:-17.5,y:17.5,z:0,rx:0,ry:0,rz:0,a:5,b:5,c:30},
			{id:"font_left",x:17.5,y:0,z:17.5,rx:0,ry:0,rz:0,a:5,b:30,c:5},
			{id:"font_right",x:17.5,y:0,z:-17.5,rx:0,ry:0,rz:0,a:5,b:30,c:5},
			{id:"back_right",x:-17.5,y:0,z:-17.5,rx:0,ry:0,rz:0,a:5,b:30,c:5},
			{id:"back_left",x:-17.5,y:0,z:17.5,rx:0,ry:0,rz:0,a:5,b:30,c:5}
		];
		
		for(var n=0;n<info.length;n++){
			var mesh=null;
			if(n<6){
				mesh=new THREE.Mesh(
					new THREE.PlaneGeometry(info[n].a,info[n].b),
					new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("textures/"+info[n].id+"_"+param.language+".png")})
				);
			}else if(n>5){
				mesh=new THREE.Mesh(
					new THREE.BoxGeometry(info[n].a,info[n].b,info[n].c),
					new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("textures/background.png")})
				);	
			}
			mesh.position.x=info[n].x;
			mesh.position.y=info[n].y;
			mesh.position.z=info[n].z;
			mesh.rotation.x=Math.PI*info[n].rx;
			mesh.rotation.y=Math.PI*info[n].ry;
			mesh.rotation.z=Math.PI*info[n].rz;
			mesh.id=info[n].id;
			_scene.add(mesh);
		}	
		
		
		_this
		.bind("mouseleave",function(e){
			if(_INTERSECTED){_INTERSECTED.material.opacity=1;}
			_INTERSECTED=null;	
		})
		.bind("mousedown",function(e){
			_tmpMouse[0]=e.clientX;
			_tmpMouse[1]=e.clientY;	
			$(window)
			.bind("mousemove",freeRotateCamera)
			.bind("mouseup",unbindMouseMove)
		})
		.bind("mousemove",function(e){
			var pos=_this.position();
			var vector=new THREE.Vector3(
				((e.clientX-pos.left)/param.width)*2-1,
				-((e.clientY-pos.top)/param.height)*2+1,
				1
			);
			_projector.unprojectVector(vector,_camera);
			_raycaster.set(_camera.position,vector.sub(_camera.position).normalize());
			var intersects = _raycaster.intersectObjects(_scene.children);
			if(intersects.length>0){
				if(_INTERSECTED!=intersects[0].object){
					if(_INTERSECTED){_INTERSECTED.material.opacity=1;}
					_INTERSECTED=intersects[0].object;
					_INTERSECTED.material.opacity=0.2
				}
			} else {
				if (_INTERSECTED){_INTERSECTED.material.opacity=1;}
				_INTERSECTED = null;
			}			
		})
		.bind("mouseup",function(e){
			$(window).unbind("mousemove",freeRotateCamera);
			if(_cameraRotated){_cameraRotated=false;return;}	
			if(!_INTERSECTED){return;}
			command=_INTERSECTED.id;
			var a=_cameraAngleA,b=_cameraAngleB;
			switch(command){
				case "font_left_top":a=45;b=45;break;
				case "left_top_back":a=45;b=135;break;
				case "back_top_right":a=45;b=225;break;
				case "font_right_top":a=45;b=315;break;
				case "left_font_bottom":a=-45;b=45;break;
				case "left_back_bottom":a=-45;b=135;break;
				case "right_back_bottom":a=-45;b=225;break;
				case "font_right_bottom":a=-45;b=315;break;
				case "left_top":a=45;b=90;break;
				case "left_bottom":a=-45;b=90;break;
				case "top_right":a=45;b=270;break;
				case "bottom_right":a=-45;b=270;break;
				case "top_font":a=45;b=0;break;
				case "bottom_font":a=-45;b=0;break;
				case "top_back":a=45;b=180;break;
				case "back_bottom":a=-45;b=180;break;
				case "font_left":a=0;b=45;break;
				case "font_right":a=0;b=315;break;
				case "back_right":a=0;b=225;break;
				case "back_left":a=0;b=135;break;
				case "left":a=0;b=90;break;
				case "right":a=0;b=270;break;
				case "font":a=0;b=0;break;
				case "back":a=0;b=180;break;
				case "top":a=89;break;
				case "bottom":a=-89;break;
				default:break;	
			}
			cameraAngleTo(a,"A");
			cameraAngleTo(b,"B");	
		});
		

		
		//辅助函数
		function toA(dx){
			if(dx==0){return;}
			var dy=_cameraMoveSpeed*dx*90/Math.PI/$(window).height();
			if(_cameraAngleA<90&&_cameraAngleA+dy>90){dy=0}
			if(_cameraAngleA>-90&&_cameraAngleA+dy<-90){dy=0}
			_cameraAngleA=_cameraAngleA+dy;
		}
		function toB(dx){
			if(dx==0){return;}
			_cameraAngleB+=_cameraMoveSpeed*dx*90/Math.PI/$(window).width();
			if(_cameraAngleB>360){_cameraAngleB-=360;}
			if(_cameraAngleB<0){_cameraAngleB+=360;}
		}
		function freeRotateCamera(e){
			var dx=e.clientY-_tmpMouse[1];
			var dy=e.clientX-_tmpMouse[0];
			if(dx==0 && dy==0){return;}
			toA(e.clientY-_tmpMouse[1]);
			toB(e.clientX-_tmpMouse[0]);
			_tmpMouse=[e.clientX,e.clientY];
			_cameraRotated=true;
			_camera.position=getCameraPos();
			updateStage();
		}
		function unbindMouseMove(e){
			_cameraRotated=false;
			$(window).unbind("mousemove",freeRotateCamera);	
		}
		function getCameraPos(){
			var y=_cameraRadius*Math.sin(Math.PI*_cameraAngleA/180);
			var x=_cameraRadius*Math.cos(Math.PI*_cameraAngleA/180)*Math.cos(Math.PI*_cameraAngleB/180);
			var z=_cameraRadius*Math.cos(Math.PI*_cameraAngleA/180)*Math.sin(Math.PI*_cameraAngleB/180);
			return {x:x,y:y,z:z};
		}
		function updateStage(){
			if(_stage.length==0){return;}	
			for(var n=0;n<_stage.length;n++){
				_stage[n].setCamera({a:_cameraAngleA,b:_cameraAngleB});
			}
		}
		function cameraAngleTo(to,type){
			if(type=="A"){
				var old=_cameraAngleA;
				var step=Math.abs(old-to)/10;
				if(step<1){
					_cameraAngleA=to;
					_camera.position=getCameraPos();
					updateStage();
					return;
				}
				if(old>to){_cameraAngleA-=step;}else{_cameraAngleA+=step;}
				_camera.position=getCameraPos();
				updateStage();
				setTimeout(function(){cameraAngleTo(to,type)},5);
			}
			if(type=="B"){
				var old=_cameraAngleB;
				var step=Math.abs(old-to)/10;
				if(step<1){
					_cameraAngleB=to;
					_camera.position=getCameraPos();
					updateStage();
					return;
				}
				if(old>to){_cameraAngleB-=step;}else{_cameraAngleB+=step;}
				_camera.position=getCameraPos();
				updateStage();
				setTimeout(function(){cameraAngleTo(to,type);},5);
			}
		}
		
		_this[0].onmousewheel=function(event){return false;}
		_this[0].appendChild( _renderer.domElement);
		_camera.position=getCameraPos();
		_scene.add(new THREE.AmbientLight(0xffffff));
		_renderer.setClearColor(0xff0000,0);
		_renderer.setSize(param.width,param.height);
		
		
		
		//接口
		_this.animate=function(){
			_camera.lookAt(_cameraLookAt);
			_renderer.render(_scene,_camera);
		}
		_this.addStage=function(stage){
			_stage.push(stage);
		}
		_this.cameraRotated=function(){return _cameraRotated;}
		_this.cameraAngleTo=function(obj){
			if(obj.a!=null) cameraAngleTo(obj.a,"A");
			if(obj.b!=null) cameraAngleTo(obj.b,"B");	
		}
		return _this;
	}
})(jQuery);