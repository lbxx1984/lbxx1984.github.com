function Stage(){
	this.$2d=null;
	this.$3d=null;
	this.view="3d";
	this.cameraController=null;
	this.scene=null;
	this.current=null;
	this.eventHandle={};
}

//物体操作接口
Stage.prototype.meshTransform=function(geo,type,item,value,sync){
	if(!geo) return;
	if(type=="joint"){
		var pos=tcMath.Global2Local(value[0],value[1],value[2],geo);
		geo.geometry.vertices[item].x=pos[0];
		geo.geometry.vertices[item].y=pos[1];
		geo.geometry.vertices[item].z=pos[2];
		geo.geometry.verticesNeedUpdate=true;
	}else{ 
		if(type!="scale"){
			geo[type][item]=value;
		}else{
			if(sync){
				geo.scale.x=geo.scale.x*value;
				geo.scale.y=geo.scale.y*value;
				geo.scale.z=geo.scale.z*value;
			}else{
				geo.scale[item]=geo.scale[item]*value;
			}
		}
	}
	this.$2d.meshFresh(geo);
	if(this.eventHandle["onMesh3DFresh"])  this.eventHandle["onMesh3DFresh"]();
}
Stage.prototype.meshDelete=function(id){
	var geo=this.$3d.getChild(id);
	if(geo){
		this.$3d.removeGeometry(geo);
		this.$2d.deleteMesh(geo.id);
	}
}
Stage.prototype.meshVisible=function(id,value){
	var geo=this.$3d.getChild(id);
	if(geo){
		geo.visible=value;
		if(this.view!="3d") this.$2d.meshVisible(id,value,geo);
	}
}
Stage.prototype.meshLock=function(id,value){
	var geo=this.$3d.getChild(id);
	if(geo){
		geo.locked=value;
	}
}
Stage.prototype.getGeometryByID=function(id){
	return this.$3d.getChild(id);	
}
Stage.prototype.getGeometryByMouse=function(e){
	var geo=null;
	if(this.view =="3d"){
		geo=this.$3d.selectGeometry();
		if(!geo || geo.locked) return null;
	}else if(e.target.tagName=="path" && e.target.geoID!=null){
		geo=this.$3d.getChild(e.target.geoID);
		if(!geo || geo.locked) return null;
		this.$2d.meshHover(e.target.geoID);	
	}else{
		this.$2d.meshHover(null);	
	}
	return geo;
}

//舞台属性设置接口
Stage.prototype.cameraMove=function(dx,dy){
	if(this.view=="3d" && !this.cameraController.cameraRotated()){
		this.$3d.cameraLookAt(dx,dy);
	}else if(this.view!="3d" ){
		this.$2d.lookAt(dx,-dy,true);
	}	
}
Stage.prototype.zoomTo=function(v){
	if(isNaN(v)) return;
	this.current.zoomTo(v);	
}
Stage.prototype.setRendererColor=function(e){
	this.$3d.setRendererColor(e);
	this.$2d.css({"background-color":e});	
}
Stage.prototype.setGridColor=function(e){
	this.$3d.setGridColor(e);
	this.$2d.setGridColor(e);	
}
Stage.prototype.addClass=function(className){
	this.current.addClass(className);
}	
Stage.prototype.clearClass=function(){
	this.current.removeClass();	
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
	this.$3d.resize(width,height);
	this.$2d.resize(width,height);	
}

//舞台信息获取接口
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

//底层接口
Stage.prototype.bind=function(stage2d, stage3d, cameraController){
	this.$2d=stage2d;
	this.$3d=stage3d;
	this.current=this.$3d;
	this.cameraController=cameraController;
	this.scene=stage3d.getScene();
	cameraController.addStage(stage3d);
	stage3d.addPlugin("cameraController",cameraController);
	stage2d.bindStage(stage3d);
}
Stage.prototype.callFunc=function(func,param){
	if(func=="toggleAxis"){
		this.$2d[func]();
		this.$3d[func]();
	}else{
		this.current[func](param);
	}	
}
Stage.prototype.addListener=function(type,func){
	this.eventHandle[type]=func;
	this.$3d.addListener(type,func);	
	this.$2d.addListener(type,func);	
}
Stage.prototype.removeListener=function(type){
	delete this.eventHandle[type];
	this.$3d.removeListener(type);
	this.$2d.removeListener(type);	
}