//Config
var language="en";
var config={
	width:0,
	height:0,
	tool:"cameramove",
	view:"3d",
	mouse:{
		down_3d:new THREE.Vector3(),
		down_2d:new THREE.Vector3(),
		up_3d:new THREE.Vector3(),
		up_2d:new THREE.Vector3(),
		isDown:false		
	}
}

//UI
var informationBar=null;
var affiliatedBar=null;

//Controller
var stage=new Stage();				//主编辑器
var transformer=new Transformer();	//变换器，用于平移、旋转、缩放物体
var morpher=new Morpher();			//变形器，也叫关节编辑器，用于变换物体形状
var temporaryGeometry={mesh:null,material:null}	//TODO

//启动入口
function main(){
	var language="en";
	if (!Detector.webgl){
		document.body.innerHTML="";
		document.body.style.color="#000";
		document.body.style.backgroundColor="#fff";
		Detector.addGetWebGLMessage();
	} else {
		onResize();
		//UI初始化
		setup_menuBar();
		setup_tabContent();
		setup_controlBar();
		affiliatedBar=setup_affiliatedBar();
		informationBar=setup_informationBar();
		//控制器初始化
		setup_workspace();
		setup_transformer();
		setup_morpher();
		//挂接事件
		$(window).bind("resize",onResize);
		//待处理
		setup_temporaryGeometry();
	}
}

//控制路由器
function control_routing(param){
	//视图切换命令
	if(param.type=="view" && config.view!=param.cmd){
		config.view=param.cmd;
		stage.changeTo(config.view);
		return;	
	}
	//一次性命令
	if(param.type=="click"){
		switch(param.cmd){
			case "grid_hidden":
				stage.callFunc("toggleAxis");break;
			case "grid_show":
				stage.callFunc("toggleAxis");break;
			case "grid_big":
				stage.callFunc("resizeGrid",1);break;
			case "grid_small":
				stage.callFunc("resizeGrid",0);break;
			case "camera_zoomin":
				stage.callFunc("zoomCamara",1);break;
			case "camera_zoomout":
				stage.callFunc("zoomCamara",0);break;
			case "transformer_translate":
				transformer.setMode("translate");break;
			case "transformer_rotate":
				if(config.view!="3d"){alert("TODO ^_^");return;}
				transformer.setMode("rotate");break;
			case "transformer_scale":
				if(config.view!="3d"){alert("TODO ^_^");return;}
				transformer.setMode("scale");break;
			case "transformer_enlarge":
				transformer.setSize(1);break;
			case "transformer_narrow":
				transformer.setSize(-1);break;
			case "transformer_world":
				if(config.view!="3d"){alert("TODO ^_^");return;}
				transformer.setSpace("world");break;
			case "transformer_local":
				if(config.view!="3d"){alert("TODO ^_^");return;}
				transformer.setSpace("local");break;	
			default:break;	
		}
		return;
	}
	//状态持续命令
	//命令：创建物体。切换回3D场景并让摄像机脱离侧视状态
	if(param.cmd.indexOf("g_")>-1){
		if(!stage.$3d.isGridLocked()){
			stage.cameraController.cameraAngleTo({a:45});
		}
		if(config.view!="3d"){
			config.view="3d";
			stage.changeTo("3d");
			$("#control").find("div[id^='view']").removeClass("active");
			$("#view_3d").addClass("active");			
		}	
	}
	//命令：非变换器。变换器解绑
	if(param.cmd!="transformer")
		transformer.detach();
	//命令：非变形器。变形器解绑
	if(param.cmd!="morpher")
		morpher.detach();
	//命令类型：工具类，控制栏不符合条件的按钮取消高亮	
	if(param.type=="tool" && param.fressControl) 
		$("#control").find("div[id^='"+param.type+"']").removeClass("active");		
	//设置命令
	config.tool=param.cmd;
}