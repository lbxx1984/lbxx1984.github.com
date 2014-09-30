var language="en";
var config={
	tool:"cameramove",
	view:"3d",
	mouse:{
		down_3d:new THREE.Vector3(),
		down_2d:new THREE.Vector3(),
		up_3d:new THREE.Vector3(),
		up_2d:new THREE.Vector3(),
		isDown:false		
	},
	selectorConfig:{
		mode:"translate",
		space:"world"	
	}
}
var stage2d=null;
var stage3d=null;
var cameraController=null;
var selector=null;
var selector2d=null;
var jointer=null;
var jointer2d=null;
var informations=null;
var affiliatedBar=null;
var temporaryGeometry={mesh:null,material:null};
var scene3d=null;


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
		setup_menu();
		setup_tab();
		setup_workspace();
		setup_control();
		setup_information();
		setup_temporaryGeometry();
		setup_affiliatedBar();
		setup_selector();
		setup_jointer();
		$(window).bind("resize",onResize);
	}
}


//控制路由器
function control_routing(param){
	////编辑器切换
	if(param.type=="view" && config.view!=param.cmd){
		config.view=param.cmd;
		if(param.cmd=="3d"){
			stage3d.display(true);
			stage2d.addClass("workspace_hideStage");
			stage3d.removeClass("workspace_hideStage");
			cameraController.removeClass("workspace_hideStage");
			jointer.update(true);
		}else{
			stage3d.display(false);
			stage3d.addClass("workspace_hideStage");
			cameraController.addClass("workspace_hideStage");
			stage2d.removeClass("workspace_hideStage");
			stage2d.changeView(param.cmd);
		}
		return;	
	}
	////一次性命令
	if(param.type=="click"){
		var stage=(config.view=="3d")?stage3d:stage2d;
		switch(param.cmd){
			case "grid_hidden":
				stage.toggleAxis();
				break;
			case "grid_show":
				stage.toggleAxis();
				break;
			case "grid_big":
				stage.resizeGrid(1);
				break;
			case "grid_small":
				stage.resizeGrid(0);
				break;
			case "camera_zoomin":
				stage.zoomCamara(1);
				break;
			case "camera_zoomout":
				stage.zoomCamara(0);
				break;
			case "selector_translate":
				selector.setMode(config.selectorConfig.mode);
				selector2d.setMode(config.selectorConfig.mode);
				break;
			case "selector_rotate":
				selector.setMode(config.selectorConfig.mode);
				selector2d.setMode(config.selectorConfig.mode);
				break;
			case "selector_scale":
				selector.setMode(config.selectorConfig.mode);
				selector2d.setMode(config.selectorConfig.mode);
				break;
			case "selector_enlarge":
				selector.setSize(selector.getSize()+0.1);
				selector2d.setSize(Math.min(selector.getSize()+0.1,2));
				break;
			case "selector_narrow":
				selector.setSize(Math.max(selector.getSize()-0.1,0.1));
				selector2d.setSize(Math.max(selector.getSize()-0.1,0.1));
				break;
			case "selector_world":
				selector.setSpace(config.selectorConfig.space);
				selector2d.setSpace(config.selectorConfig.space);
				break;
			case "selector_local":
				selector.setSpace(config.selectorConfig.space);
				selector2d.setSpace(config.selectorConfig.space);
				break;		
			default:break;	
		}
		return;
	}
	////需要保存状态的命令
	//////要通过拖拽创建物体，要切换回3D场景并让摄像机脱离测试状态
	if(param.cmd.indexOf("g_")>-1){
		if(!stage3d.isGridLocked()){cameraController.cameraAngleTo({a:45});}
		if(config.view!="3d"){
			config.view="3d";
			stage3d.display(true);
			stage2d.addClass("workspace_hideStage");
			stage3d.removeClass("workspace_hideStage");
			cameraController.removeClass("workspace_hideStage");
			$("#control").find("div[id^='view']").removeClass("tabActive");
			$("#view_3d").addClass("tabActive");			
		}	
	}
	//////清理选择器，如果命令不是选择器，但选择器在工作，就把选择器取消
	if(param.cmd!="selector" && selector.isWorking()){
		selector.detach();	
	}
	//////清理关节编辑器，如果命令不是关节编辑器，但关节编辑器在工作，就把关节编辑器取消
	if(param.cmd!="jointer" && jointer.isWorking()){
		jointer.detach();
		jointer2d.detach();
		stage2d.meshClearSelected();
	}
	//////更新控制栏中的同类按钮样式，只允许当前激活的高亮	
	if(param.type=="tool" && param.fressControl){
		$("#control").find("div[id^='"+param.type+"']").removeClass("tabActive");		
	}
	////设置命令
	config.tool=param.cmd;
}