function Stage(){
	this.$2d=null;
	this.$3d=null;
	this.view="3d";
	this.cameraController=null;
	this.scene=null;
	this.current=null;
}
Stage.prototype.getGeometryByMouse=function(e){
	var geo=null;
	if(this.view =="3d"){
		geo=this.$3d.selectGeometry();
	}else if(e.target.tagName=="path" && e.target.geoID!=null){
		this.$2d.meshHover(e.target.geoID);
		geo=this.$3d.getChild(e.target.geoID);
	}else{
		this.$2d.meshHover(null);	
	}
	return geo;
}
Stage.prototype.getMorpherJointByMouse=function(e,joints){
	var geo=null;
	if(this.view=="3d"){
		geo=this.$3d.selectGeometry(joints);	
	}else if(e.target.tagName=="circle" && e.target.morpherType=="JOINT"){
		geo=joints[e.target.index];
	}
	return geo;
}
Stage.prototype.getTransformerCommand=function(e){
	if(this.view =="3d" || !e || !e.target) return null;
	if(e.target.tcType=="T2D") return {cmd:e.target.tcItem, cursor:"workspace_"+e.target.tcCursor};
	return null	
}
Stage.prototype.getMousePosition=function(){
	return this.current.getMousePosition(this.view);	
}
Stage.prototype.bind=function(stage2d, stage3d, cameraController){
	this.$2d=stage2d;
	this.$3d=stage3d;
	this.current=this.$3d;
	this.cameraController=cameraController;
	this.scene=stage3d.getScene();
	cameraController.addStage(stage3d);
	stage3d.setCameraController(cameraController);
	stage2d.bindStage(stage3d);
}
Stage.prototype.callFunc=function(func,param){
	this.current[func](param);	
}
Stage.prototype.addClass=function(className){
	this.current.addClass(className);
}	
Stage.prototype.clearClass=function(){
	this.current.removeClass();	
}
Stage.prototype.cameraMove=function(dx,dy){
	if(this.view=="3d" && !this.cameraController.cameraRotated()){
		this.$3d.cameraLookAt(dx,dy);
	}else if(this.view!="3d" ){
		this.$2d.lookAt(dx,-dy,true);
	}	
}
Stage.prototype.changeTo=function(view){
	if(view=="3d"){
		this.current=this.$3d;
		this.$2d.addClass("workspace_hideStage");
		this.$3d.display(true);
		this.$3d.removeClass("workspace_hideStage");
		this.cameraController.removeClass("workspace_hideStage");
	}else{
		this.current=this.$2d;
		this.$2d.removeClass("workspace_hideStage");
		this.$2d.changeView(view);
		this.$3d.display(false);
		this.$3d.addClass("workspace_hideStage");
		this.cameraController.addClass("workspace_hideStage");	
	}
	this.view=view;
}
Stage.prototype.resize=function(width,height){
	if(!this.$2d) return;
	this.$3d.resize(config.width,config.height);
	this.$2d.resize(config.width,config.height);	
}