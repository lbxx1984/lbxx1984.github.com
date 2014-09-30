//初始化工作区
function setup_workspace(){
	//初始化2D编辑器
	stage2d=$("#stage2d");
	stage2d
		.Stage2D({
			width:stage2d.width(),height:stage2d.height(),	
			clearColor:"#2A333A",
			gridColor:"#999999",
			meshColor:"#F0F0F0",
			meshSelectColor:"yellow",
			meshHoverColor:"#D97915",
			showGrid:true
		});
	//为2D编辑器添加事件
	stage2d
		.bind("mouseRightClick",stage2d_mouserightclick)
		.bind("mousedown",stage2d_mousedown)
		.bind("mouseup",stage2d_mouseup)
		.bind("mousemove",stage2d_mousemove)
		.bind("mouse3Dchange",function(e,p){
			informations.mousePosition({mouse3d:p});
		});
	//初始化3D编辑器
	stage3d=$("#stage3d");
	stage3d
		.Stage3D({
			width:stage3d.width(),height:stage3d.height(),
			clearColor:0x2A333A,gridColor:0x999999,
			showGrid:true
		});
	//为3D编辑器添加事件
	stage3d
		.bind("mouseRightClick",stage3d_mouserightclick)
		.bind("mousedown",stage3d_mousedown)
		.bind("mouseup",stage3d_mouseup)
		.bind("mousemove",stage3d_mousemove)
		.bind("mouse3Dchange",function(e,p){
			informations.mousePosition({mouse3d:p});
		});
	//其他
	cameraController=$("#cameraController").CameraController({
		width:100,
		height:100,
		showAxis:true,
		language:language
	});
	scene3d=stage3d.getScene();
	cameraController.addStage(stage3d);
	stage3d.setCameraController(cameraController);
	stage2d.bindStage(stage3d);
}

//初始化选择器
function setup_selector(){
	//3d
	selector=Transformer(stage3d.getCamera(),stage3d.getRenderer(),stage3d.getScene());
	stage3d.setTransformer(selector);
	selector.onDetach(function(){
		if(!jointer.isWorking()){affiliatedBar.hide();}
		selector2d.detach();
		stage2d.meshClearSelected();
	});
	//2d
	selector2d=Transformer2D(stage2d);
	stage2d.setSelector(selector2d);
}

//初始化关节操作器
function setup_jointer(){
	//3d
	jointer=JointsController(stage3d.getCamera(),stage3d.getScene());
	stage3d.setJointsController(jointer);
	jointer.onDetach(affiliatedBar.hide);
	//2d
	jointer2d=JointsController2D(stage2d);
	stage2d.setJointsController(jointer2d);
	jointer2d.onDetach(affiliatedBar.hide);
}

//初始化临时物体材质
function setup_temporaryGeometry(){
	var map = THREE.ImageUtils.loadTexture('textures/ash_uvgrid01.jpg');
	map.wrapS = THREE.RepeatWrapping;
	map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 16;
	temporaryGeometry.material=new THREE.MeshLambertMaterial({
		ambient: 0xbbbbbb, map:map,side: THREE.DoubleSide
	});		
}

//初始化信息栏
function setup_information(){
	var dis=$("#information");	
	informations={
		alert:function(str){
			dis.html(str);
		},
		mousePosition:function(pos){
			dis.html("x:"+parseInt(pos.mouse3d.x)+" y:"+parseInt(pos.mouse3d.y)+" z:"+parseInt(pos.mouse3d.z));
		}	
	}
}

//初始化控制栏
function setup_control(){
	$("#control").bind("click",function(event){
		if(event.target.id==null) return;
		var arr=event.target.id.split("_");
		if(arr[0]=="view" || arr[0]=="tool"){
			$(this).find("div[id^='"+arr[0]+"']").removeClass("tabActive");	
			$(event.target).addClass("tabActive");
			control_routing({type:arr[0],cmd:arr[1]});		
		}else{
			if(event.target.id=="grid_show"){
				event.target.data_hidden=!event.target.data_hidden;	
				if(event.target.data_hidden){
					$(event.target).addClass("grid_hidden");
					control_routing({type:"click",cmd:"grid_hidden"});	
				}else{
					$(event.target).removeClass("grid_hidden");
					control_routing({type:"click",cmd:"grid_show"});	
				}
			}else{
				control_routing({type:"click",cmd:event.target.id});
			}
		}
	});	
}

//初始化附属控制栏
function setup_affiliatedBar(){
	var bar=$("#affiliatedButtons");
	bar.bind("click",function(event){
		if(event.target.id==null) return;
		var arr=event.target.id.split("_");
		
		if(arr.length==3 && arr[0]=="selector"){
			$(this).find("div[id^='"+arr[0]+"']").removeClass("tabActive");
			$(event.target).addClass("tabActive");
			config.selectorConfig.mode=arr[1];
			control_routing({type:"click",cmd:arr[0]+"_"+arr[1]});	
		}else if(arr[1]=="world"){
			if(config.selectorConfig.space=="world"){
				$(event.target).removeClass("selector_world");
				$(event.target).addClass("selector_local");
				config.selectorConfig.space="local";	
			}else{
				$(event.target).removeClass("selector_local");
				$(event.target).addClass("selector_world");
				config.selectorConfig.space="world";	
			}
			control_routing({type:"click",cmd:arr[0]+"_"+config.selectorConfig.space});		
		}else{
			control_routing({type:"click",cmd:arr[0]+"_"+arr[1]});	
		}
	});
	affiliatedBar={
		show:function(type){
			bar.css({"display":"block"});
			bar.find("div,span").css("display","none");
			bar.find("[id^='"+type+"']").css("display","inline-block");	
		},
		hide:function(){
			bar.css({"display":"none"});
		}
	}
}

//初始化右侧面板
function setup_tab(){
	$("#tabNavigator>li").bind("click",function(event){
		if(this.parentNode.currentActive==null){
			this.parentNode.currentActive=this.parentNode.firstChild;
		}
		$(this.parentNode.currentActive).removeClass("tabActive");	
		$("#"+this.parentNode.currentActive.innerHTML).addClass("tabItem");
		this.parentNode.currentActive=this;
		$(this.parentNode.currentActive).addClass("tabActive");	
		$("#"+this.parentNode.currentActive.innerHTML).removeClass("tabItem");
	});
}

//初始化菜单
function setup_menu(){
	$("#menu").bind("mouseleave",function(event){
		$("#menu").find("div").css({"display":"none"});	
	});
	$("#menu>ul>li").bind("mousemove",function (event){
		if(this.parentNode.parentNode.currentShow){
			$("#"+this.parentNode.parentNode.currentShow).css("display","none");
		}
		this.parentNode.parentNode.currentShow=event.target.innerHTML;
		$("#"+this.parentNode.parentNode.currentShow).css({
			"display":"block",
			"left":$(this).offset().left+"px"
		});		
	});
	$("#menu .menuitem").bind("click",function(event){
		if(event.target.id.indexOf("g_")>-1){
			control_routing({type:"tool",cmd:event.target.id,fressControl:true});
		}
	});
}

//设置工作区等组件大小
function onResize(){
	var win=$(window);
	var width=win.width();
	var height=win.height()
	$("#workspace").css({width:(width-301)+"px",height:(height-72)+"px"});
	//$("#menu").css({"width":(width-301)+"px"});	
	$("#control").css({"width":(width-301)+"px"});
	$("#affiliatedButtons").css({"width":(width-601)+"px"});
	$("#stage3d").css({width:(width-301)+"px",height:(height-72)+"px"});
	$("#stage2d").css({width:(width-301)+"px",height:(height-72)+"px"});
	if(stage3d) stage3d.resize(width-301,height-72);
	if(stage2d) stage2d.resize(width-301,height-72);
}