//初始化临时物体材质
function setup_temporaryGeometry(){
	var map = THREE.ImageUtils.loadTexture('textures/ash_uvgrid01.jpg');
	map.wrapS = THREE.RepeatWrapping;
	map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 16;
	/*
	temporaryGeometry.material=new THREE.MeshLambertMaterial({
		color: 0xFFFF00, side: THREE.DoubleSide
	});
	
	*/
	temporaryGeometry.material=new THREE.MeshBasicMaterial({
		color: 0xFFFF00,side:THREE.DoubleSide
	});
}










///////////////////////////以下冻结/////////////////////////////////
//初始化变换器
function setup_transformer(){
	transformer.bind(stage);
	transformer.onDetach(affiliatedBar.hide);
}
//初始化变形器
function setup_morpher(){
	morpher.bind(stage);
	morpher.onDetach(affiliatedBar.hide);
}
//初始化工作区
function setup_workspace(){	
	//初始化2D编辑器
	var d2=$("#stage2d").Stage2D({
		width:config.width,
		height:config.height,	
		clearColor:"#2A333A",
		gridColor:"#999999",
		meshColor:"#F0F0F0",
		meshSelectColor:"yellow",
		meshHoverColor:"#D97915",
		showGrid:true
	})
	//初始化3D编辑器
	var d3=$("#stage3d").Stage3D({
		width:config.width,
		height:config.height,
		clearColor:0x2A333A,
		gridColor:0x999999,
		showGrid:true
	})
	//摄像机控制器
	var ctrl=$("#cameraController").CameraController({
		width:100,
		height:100,
		showAxis:true,
		language:language
	});
	//绑定事件
	$("#workspace")
		.bind("mousedown",mousedown)
		.bind("mouseup",mouseup)
		.bind("mousemove",mousemove)
		.bind("contextmenu",mouseRightClick);
	stage.bind(d2,d3,ctrl);
}
//初始化信息栏
function setup_informationBar(){
	var dis=$("#information");	
	return {
		alert:function(str){
			dis.html(str);
		},
		mousePosition:function(pos){
			dis.html("x:"+parseInt(pos.mouse3d.x)+" y:"+parseInt(pos.mouse3d.y)+" z:"+parseInt(pos.mouse3d.z));
		}	
	}
}
//初始化附属控制栏
function setup_affiliatedBar(){
	var bar=$("#affiliatedButtons");
	bar.bind("click",function(event){
		if(event.target.id==null) return;
		var arr=event.target.id.split("_");
		if(arr.length==3 && arr[0]=="transformer"){
			$(this).find("div[id^='"+arr[0]+"']").removeClass("active");
			$(event.target).addClass("active");
			control_routing({type:"click",cmd:arr[0]+"_"+arr[1]});	
		}else if(arr[1]=="world"){
			var tag=$(event.target),key="world";
			tag.removeClass("transformer_world");
			tag.removeClass("transformer_local");
			if(tag[0].current==1){
				tag[0].current=0;
				tag.addClass("transformer_world");
			}else{
				tag[0].current=1;
				key="local"
				tag.addClass("transformer_local");
			}
			control_routing({type:"click",cmd:arr[0]+"_"+key});		
		}else{
			control_routing({type:"click",cmd:arr[0]+"_"+arr[1]});	
		}
	});
	return {
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
//初始化控制栏
function setup_controlBar(){
	$("#control").bind("click",function(event){
		if(event.target.id==null) return;
		var arr=event.target.id.split("_");
		if(arr[0]=="view" || arr[0]=="tool"){
			$(this).find("div[id^='"+arr[0]+"']").removeClass("active");	
			$(event.target).addClass("active");
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
//初始化右侧面板
function setup_tabContent(){
	$("#tabNavigator li").bind("click",function(event){
		if(this.parentNode.currentActive==null){
			this.parentNode.currentActive=this.parentNode.firstChild;
		}
		$(this.parentNode.currentActive).removeClass("active");	
		this.parentNode.currentActive=this;
		$(this.parentNode.currentActive).addClass("active");	
		$("#tabContent>div").addClass("tabItemHide");
		var id=$(this).text().replace(/[^a-z]/ig,"");
		$("#"+id).removeClass("tabItemHide");
	});
	function hideItem(event){
		var id=this.id.substr(1);
		var type=this.innerHTML.charAt(0);
		var inner=this.innerHTML.substr(1);
		type=(type=="▼")?"▶":"▼"
		this.innerHTML=type+inner;
		if(type=="▼"){
			$("#"+id).removeClass("tabItemHide");	
		}else{
			$("#"+id).addClass("tabItemHide");
		}
	}
	$("#SCENE label").bind("click",hideItem);
	$("#MESH label").bind("click",hideItem);
}
//初始化菜单
function setup_menuBar(){
	$("#menu").bind("mouseleave",function(event){
		$("#menu").find("div").css({"display":"none"});	
	});
	$("#menu>ul>li").bind("mousemove",function (event){
		if(this.parentNode.parentNode.currentShow){
			$("#"+this.parentNode.parentNode.currentShow).css("display","none");
		}
		this.parentNode.parentNode.currentShow=event.target.innerHTML.replace(/[^a-z]/ig,"");
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
//设置组件大小
function onResize(){
	var win=$(window),width=win.width(),height=win.height();
	config.width=width-301;
	config.height=height-72;
	$("#workspace").css({width:config.width+"px",height:config.height+"px"});
	$("#control").css({"width":config.width+"px"});
	$("#affiliatedButtons").css({"width":(config.width-300)+"px"});
	$("#stage3d").css({width:config.width+"px",height:config.height+"px"});
	$("#stage2d").css({width:config.width+"px",height:config.height+"px"});
	stage.resize(config.width,config.height);
}