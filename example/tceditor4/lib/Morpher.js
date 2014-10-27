// JavaScript Document
function Morpher(){
	this.$2d=null;
	this.$3d=null;
	this.s2d=null;
	this.s3d=null;
	this.scene=null;
	this.jointCtrl=null;//3d
	this.config={
		geo:null,
		joint:null,
		changing:false,
		working:0, //0表示未工作，1表示已经选择了物体尚未选择关节（只在3D中有效），2表示已经选择了物体，也选择了关节	
		ondetach:null,
		onchange:null
	}
}
Morpher.prototype.animate=function(){
	this.jointCtrl.update();
}
Morpher.prototype.dragging=function(d2,d3){
	this.$2d.dragging(d2,d3);
	this.config.changing=true;	
}
Morpher.prototype.dragover=function(op,np){
	var dp=this.$2d.dragover(op,np);
	this.config.changing=false;	
	if(this.config.joint){
		this.config.joint.position.x+=dp[0];
		this.config.joint.position.y+=dp[1];
		this.config.joint.position.z+=dp[2];
	}
	if(this.config.onchange) this.config.onchange(this.config.joint.index);	
}
Morpher.prototype.setCommand=function(v){
	this.$2d.setCommand(v);
}
Morpher.prototype.getCommand=function(){
	return this.$2d.getCommand();
}
Morpher.prototype.attachJoint=function(joint){
	this.config.joint=joint;
	this.config.working=2;
	this.jointCtrl.attach(joint);
	this.scene.add(this.jointCtrl);
	this.$2d.attachJoint(joint.index);
}
Morpher.prototype.detachJoint=function(){
	this.config.working=1;
	this.jointCtrl.detach();
	this.scene.remove(this.jointCtrl);
	this.$2d.detachJoint();	
}
Morpher.prototype.attach=function(geo){
	if(this.jointCtrl.added) return;
	if(this.config.working!=0) this.detach(true);
	this.config.working=1;
	this.config.geo=geo;
	this.$3d.attach(geo);
	this.$2d.attach(geo.tid);
	this.s2d.meshSetSelected(geo.tid);			
}
Morpher.prototype.detach=function(){
	if(this.config.working==0) return;
	this.config.working=0;
	this.config.geo=null;
	this.config.joint=null;
	this.$3d.detach();
	this.$2d.detach();
	this.s2d.meshClearSelected();	
	this.jointCtrl.detach();
	this.scene.remove(this.jointCtrl);	
	if(this.config.ondetach) this.config.ondetach();
}
Morpher.prototype.reloadJoint=function(){
	if(this.config.working==0) return;
	this.$3d.reloadJoint();	
	this.$2d.update();
}
Morpher.prototype.resizeJoint=function(){
	this.$3d.resizeJoint();	
}
Morpher.prototype.bind=function(s){
	this.s2d=s.$2d;
	this.s3d=s.$3d;
	this.scene=this.s3d.getScene();
	this.jointCtrl = new THREE.TransformControls(this.s3d.getCamera(),this.s3d.getRenderer().domElement);
	this.jointCtrl.setMode("translate");
	this.jointCtrl.setSpace("world");
	this.$2d=Morpher2D(this.s2d);
	this.$3d=Morpher3D(this.s3d.getCamera(),this.scene);
	this.s3d.addPlugin("morpher",this);
	var _this=this;
	this.jointCtrl.onChange=function(){
		_this.$3d.moving(_this.config.joint);
		if(_this.config.onchange) _this.config.onchange(_this.config.joint.index);
	}
	return;
}
Morpher.prototype.onDetach=function(func){
	this.config.ondetach=func;
}
Morpher.prototype.onChange=function(func){
	this.config.onchange=func;
}
Morpher.prototype.getJoints=function(){
	return this.$3d.getJoints();	
}
Morpher.prototype.isWorking=function(){
	return this.config.working;	
}
Morpher.prototype.isChanged=function(){
	return this.config.changing;
}	