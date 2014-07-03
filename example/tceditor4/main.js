function main(){
	
	//全局控制变量
	var _win=$(window);
	var	_width=_win.width();
	var _height=_win.height();
	var _mouse={
		down_3d:new THREE.Vector3(),
		down_2d:new THREE.Vector3(),
		up_3d:new THREE.Vector3(),
		up_2d:new THREE.Vector3(),
		isDown:false
	};
	var _command={
		type:"",
		action:"",
		last:"",
		oneoff:false
	}
	var _view="3D";
	

	//显示组件
	var _stage2d=$("<div>").stage2D({
		width:_width,
		height:_height,
		clearColor:"#383838",
		gridColor:"#c0c0c0"
	});
	var _stage3d=$("<div>").stage3D({
		width:_width,
		height:_height-2,
		clearColor:0x383838,
		gridColor:0xc0c0c0,
		showAxis:true,
		showGrid:true
	});
	var _cameraController=$("<div>").cameraController({
		width:100,
		height:100,
		left:(_width-100)*0.5,
		top:(_height-100-40),
		showAxis:true,
		language:language
	});
	var _geometryController=null;
	var _boneController=boneController(_stage3d);
	var _bonePointController=null;
	var _stats = new Stats();
		_stats.domElement.style.cssText = 'position:absolute;left:'+(_width-95)+'px;top:'+(_height-48)+'px;width:95px;height:55px;opacity:0.6;';
	var _instrument=$("<div>").instrument({
		width:_width-100,
		height:48,
		left:0,
		top:(_height-48),
		buttons:[
			{type:"checked",command:"moveCamera",ico:"01.png",cheched:false},
			{type:"click",command:"zoomInCamera",ico:"04.png"},
			{type:"click",command:"zoomOutCamera",ico:"05.png"},
			{type:"click",command:"enlargeGrid",ico:"02.png"},
			{type:"click",command:"narrowGrid",ico:"03.png"},
			{type:"ratio",command:"showAxis",ico:"06.png",checkedICO:"07.png",cheched:false},
			{type:"checked",command:"selectGeometry",ico:"10.png",cheched:false,left:true},
			{type:"checked",command:"boneGeometry",ico:"11.png",cheched:false,left:true}
		]
	});	
	var _menu =$("<div>").menu({
		width:_width,
		height:30,
		left:0,
		top:0,
		language:language,
		data:[
			{id:"geometry",label:["物体","Geometry"]},
			{id:"material",label:["材质","Material"]},
			{id:"light",label:["灯光","Light"]},
			{id:"view",label:["视角","View"]},
			{id:"translate",label:["变换","Translate"]}
		],
		view:[
			{type:"click",command:"XOZ",checked:false},
			{type:"click",command:"XOY",checked:false},
			{type:"click",command:"YOZ",checked:false},
			{type:"click",command:"3D",checked:true}
		],
		geometry:[
			{type:"checked",command:"create",action:"plane",ico:"21.png",checked:false}
		],
		translate:[
			{type:"checked",command:"translate_ctrl",ico:"31.png",checked:true},
			{type:"checked",command:"rotate_ctrl",ico:"32.png",checked:false},
			{type:"checked",command:"scale_ctrl",ico:"33.png",checked:false},
			{type:"click",command:"increaseSize_ctrl",ico:"34.png"},
			{type:"click",command:"decreaseSize_ctrl",ico:"35.png"},
			{type:"ratio",command:"worldlocal_ctrl",ico:"36.png",checkedICO:"37.png",checked:false}
		]
	});	
	var _scene=_stage3d.getScene();	
	var _tempMesh=null;
	
	
	
	
	
	
	//挂接事件	
	_stage3d
		.setController(_cameraController)
		.setStats(_stats)
		.bind("mouse3Dchange",function(e,p){
			_instrument.update({mouse3d:p});
		})
		.bind("mousedown",function(e){
			_mouse.down_3d=_stage3d.mousePosition();
			_mouse.down_2d.x=e.clientX;
			_mouse.down_2d.y=e.clientY;
			_mouse.up_3d=_stage3d.mousePosition();
			_mouse.up_2d.x=e.clientX;
			_mouse.up_2d.y=e.clientY;
			_mouse.isDown=true;
		})
		.bind("mousemove",function(e){
			if(_command.type=="selectGeometry"){
				var tmpGeo=_stage3d.selectGeometry();
				if(tmpGeo){	
					_stage3d.css("cursor","pointer");
					_instrument.alert(notice[language][0]);
				}else{
					_stage3d.css("cursor","default");
					_instrument.alert("");
				}
			}
			if(_command.type=="boneGeometry"){
				var temp=_stage3d.selectGeometry();					
				var target=_boneController.getGeometry();			
				var point=null;										
				var arr=_boneController.getPoints();
				if(arr.length>0){point=_stage3d.selectGeometry(arr);}	
				if(point!=null){
					_stage3d.css("cursor","move");
					_instrument.alert(notice[language][1]);
				}else{
					if(temp){
						if(temp==target){
							_instrument.alert("");
							return;
						}else{
							_stage3d.css("cursor","pointer");
							_instrument.alert(notice[language][0]);
						}
					}else{
						_stage3d.css("cursor","default");
						_instrument.alert("");	
					}
				}
			}
			if(!_mouse.isDown){return;}
			if(_command.type=="moveCamera"){
				_stage3d.cameraLookAt(e.clientX-_mouse.up_2d.x,e.clientY-_mouse.up_2d.y)
			};
			_mouse.up_3d=_stage3d.mousePosition();
			_mouse.up_2d.x=e.clientX;
			_mouse.up_2d.y=e.clientY;
			if(_command.type=="create"){ReloadTemporaryGeometry();return;}
		})
		.bind("mouseup",function(e){
			_mouse.up_3d=_stage3d.mousePosition();	
			_mouse.up_2d.x=e.clientX;
			_mouse.up_2d.y=e.clientY;
			_mouse.isDown=false;
			//摄像机旋转
			if(_cameraController.cameraRotated()){return;}
			//鼠标拖拽创建物体
			if(_tempMesh){CreateGeometryByMouse();return;}
			//单击操作
			if(_mouse.down_3d.equals(_mouse.up_3d)){
				//拾取物体
				if(_command.type=="selectGeometry"){
					var tmpGeo=_stage3d.selectGeometry();
					if(tmpGeo){	
						_geometryController=_stage3d.getGeometryController();
						_geometryController.attach(tmpGeo);	
						_scene.add(_geometryController);
						_geometryController.update();
						_menu.show("translate");
					}
				}
				//骨骼拾取
				if(_command.type=="boneGeometry"){
					var temp=_stage3d.selectGeometry();					
					var target=_boneController.getGeometry();			
					var point=null;										
					var arr=_boneController.getPoints();
					if(arr.length>0){point=_stage3d.selectGeometry(arr);}	
					if(point!=null){
						_bonePointController=_stage3d.getCtrlPointController();
						_bonePointController.onChange=_boneController.updateGeometry;
						_bonePointController.attach(point);	
						_scene.add(_bonePointController);
						_bonePointController.update();
					}else{
						if(temp){
							if(temp==target){
								return;
							}else{
								if( _bonePointController){
									_bonePointController.detach();
									_scene.remove(_bonePointController);	
									_bonePointController=null;
								}
								_boneController.attach(temp);	
							}
						}
					}
				}
				//单击判断结束
				return;
			}
		})
		.appendTo(document.body);
		
	
	
	
		
	_cameraController
		.appendTo(document.body);
	
	
	
	
	_stage2d
		.bind("mouse3Dchange",function(e,p){
			_instrument.update({mouse3d:p});
		})
		.bind("mousedown",function(e){
			_mouse.down_2d.x=e.clientX;
			_mouse.down_2d.y=e.clientY;
			_mouse.isDown=true;
			if(_command.type=="moveCamera"){_stage2d.css("cursor","move");}
		})
		.bind("mousemove",function(e){
			if(!_mouse.isDown){return;}
		})
		.bind("mouseup",function(e){
			_mouse.up_2d.x=e.clientX;
			_mouse.up_2d.y=e.clientY;
			_mouse.isDown=false;
			if(_command.type=="moveCamera"){_stage2d.css("cursor","default");}
			if(_mouse.down_2d.equals(_mouse.up_2d)){return;}
			if(_command.type=="moveCamera"){
				_stage2d.offset({x:_mouse.up_2d.x-_mouse.down_2d.x,y:_mouse.down_2d.y-_mouse.up_2d.y});
				_stage2d.fresh();	
			}
		})
		.appendTo(document.body);	
		
	_instrument
		.bind("ButtonClick",function(e,cmd){ButtonClick(cmd);})
		.appendTo(document.body);
	
	
	_menu
		.bind("ButtonClick",function(e,cmd){ButtonClick(cmd);})
		.bind("TranslateCtrlButtonClick",function(e,cmd){
			if(!_geometryController){return;}
			if(cmd.command=="translate_ctrl"){
				_geometryController.setMode( "translate" );	
			}else if(cmd.command=="rotate_ctrl"){
				_geometryController.setMode( "rotate" );		
			}else if(cmd.command=="scale_ctrl"){
				_geometryController.setMode( "scale" );		
			}else if(cmd.command=="increaseSize_ctrl"){
				_geometryController.setSize( _geometryController.size + 0.1 );	
			}else if(cmd.command=="decreaseSize_ctrl"){
				_geometryController.setSize( Math.max(_geometryController.size - 0.1, 0.1 ) );
			}else if(cmd.command=="worldlocal_ctrl"){
				_geometryController.setSpace(_geometryController.space == "local" ? "world" : "local"); 
			}
		})
		.bind("ViewButtonClick",function(e,cmd){
			if(cmd==_view){return;}
			_view=cmd;
			if(_view=="3D"){
				_stage2d.css({top:-_height+"px"});
				_stage3d.display(true);
			}else{
				_stage3d.display(false);
				_stage2d[0].style.top="0px";
				_stage2d.render(_stage3d.children(),_view);	
			}
		})
		.appendTo(document.body);
	
	
	_win.bind("resize",function(){
		_width=_win.width();
		_height=_win.height();	
		_stage3d.resize(_width,_height);
		_stage2d.resize(_width,_height);
		_cameraController.setPosition((_width-100)*0.5,(_height-100-40));
		_instrument.setPosition({left:0,top:(_height-48),width:(_width-100),height:48});
		_menu.setPosition({left:0,top:0,width:_width,height:30});
		_stats.domElement.style.cssText = 'position:absolute;left:'+(_width-95)+'px;top:'+(_height-48)+'px;width:95px;height:48px;opacity:0.6;';
	});	
	
	
	window.onscroll = function(){window.scrollTo(0,0)}
	
	
	
	
	
	//辅助函数	
	function ButtonClick(cmd){
		if(cmd.type=="click"){
			if(cmd.command=="enlargeGrid"){
				if(_view=="3D"){_stage3d.resizeGrid(1);}else{_stage2d.resizeGrid(1);}
			}
			if(cmd.command=="narrowGrid"){
				if(_view=="3D"){_stage3d.resizeGrid(0);}else{_stage2d.resizeGrid(0);}
			}
			if(cmd.command=="zoomInCamera"){
				if(_view=="3D"){_stage3d.zoomCamara(1);}else{_stage2d.zoomCamara(1);_stage2d.fresh();}
			}
			if(cmd.command=="zoomOutCamera"){
				if(_view=="3D"){_stage3d.zoomCamara(0);}else{_stage2d.zoomCamara(0);_stage2d.fresh();}
			}
		}else if(cmd.type=="ratio"){
			if(cmd.command=="showAxis"){
				if(_view=="3D"){_stage3d.toggleAxis();}else{_stage2d.toggleAxis();}
			}	
		}else if(cmd.type=="checked"){	
			if(cmd.command!="selectGeometry" && _geometryController){removeGeometryController();}
			if(cmd.command!="boneGeometry"){removeBoneController();}
			if(cmd.checked){
				_command.last=_command.type;
				_command.type=cmd.command;
				if(cmd.action){_command.action=cmd.action;}
			}else{
				var tmp=_command.type;
				_command.type=_command.last;
				_command.last=tmp;
			}	
			ResetButton();
		}
	}
	function ResetButton(){
		_menu.reset(_command);
		_instrument.reset(_command);	
	}
	function removeGeometryController(){
		_geometryController.detach();
		_scene.remove(_geometryController);	
		_geometryController=null;	
	}
	function removeBoneController(){
		_boneController.detach();
		if( _bonePointController){
			_bonePointController.detach();
			_scene.remove(_bonePointController);	
			_bonePointController=null;
		}
	}
	
	
	
	
	
	function ReloadTemporaryGeometry(){
		if(!_stage3d.gridLocked()){return;}
		if(_tempMesh&&_tempMesh.added){_scene.remove(_tempMesh);}
		_tempMesh=CreateTemporaryGeometry({type:"plane"});
		_tempMesh.added=true;
		_scene.add(_tempMesh);
	}
	function CreateGeometryByMouse(){
		if(!_stage3d.gridLocked()){return;}
		var newMesh=_tempMesh.clone();
		_stage3d.addGeometry(newMesh);
		_scene.remove(_tempMesh);
		_tempMesh=null;
	}
	function CreateTemporaryGeometry(param){
		var tm=null;
		var mesh=null;
		var geo=null;
		var	rotation=null;
		
		//wireframe: true, 
		//var material=param.material||new THREE.MeshBasicMaterial( { color: 0x36519e,blending: THREE.SubtractiveBlending,side:THREE.DoubleSide});
		
		var map = THREE.ImageUtils.loadTexture( 'textures/ash_uvgrid01.jpg' );
			map.wrapS = map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 16;

		var material = new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: map, side: THREE.DoubleSide } );
		
		
		
		var center=new THREE.Vector3();
		center.x=(_mouse.down_3d.x+_mouse.up_3d.x)/2;
		center.y=(_mouse.down_3d.y+_mouse.up_3d.y)/2;
		center.z=(_mouse.down_3d.z+_mouse.up_3d.z)/2;
		if(param.type="plane"){
			geo=new THREE.PlaneGeometry( Math.abs(_mouse.up_3d.x-_mouse.down_3d.x), Math.abs(_mouse.up_3d.z-_mouse.down_3d.z),2,2);
			rotation={x:Math.PI*0.5,y:0,z:0};
		}
		mesh=new THREE.Mesh( geo,material);
		mesh.rotation.x=rotation.x;
		mesh.rotation.y=rotation.y;
		mesh.rotation.z=rotation.z;
		mesh.material.opacity=0.5;
		mesh.position.set(center.x,center.y,center.z);
		return mesh;
	}
}