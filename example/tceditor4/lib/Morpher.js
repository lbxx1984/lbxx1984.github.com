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
		ondetach:null,
		onchange:null,
		keepAlive:false,
		changing:false,
		working:0 //0表示未工作，1表示已经选择了物体尚未选择关节（只在3D中有效），2表示已经选择了物体，也选择了关节	
	}
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
	this.jointCtrl.added=true;
	this.jointCtrl.attach(joint);
	this.scene.add(this.jointCtrl);
	this.$2d.attachJoint(joint.index);
}
Morpher.prototype.detachJoint=function(outer){
	this.config.working=1;
	(outer==true)?this.config.keepAlive=false:this.config.keepAlive=true;
	this.jointCtrl.added=false;
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
	this.$2d.attach(geo.id);
	this.s2d.meshSetSelected(geo.id);			
}
Morpher.prototype.detach=function(inside){
	if(this.config.working==0) return;
	if(this.config.keepAlive){
		this.config.keepAlive=false;
		return;	
	}
	this.config.working=0;
	this.config.geo=null;
	this.config.joint=null;
	this.$3d.detach();
	this.$2d.detach();
	this.s2d.meshClearSelected();	
	if(this.jointCtrl.added){
		this.jointCtrl.added=false;
		this.jointCtrl.detach();
		this.scene.remove(this.jointCtrl);	
	}
	if(typeof this.config.ondetach=="function" && !inside) this.config.ondetach();
}
Morpher.prototype.update=function(){
	if(this.config.working==0) return;
	this.$3d.update();
	this.$2d.update();
	if(this.jointCtrl.added){this.jointCtrl.update();}
}
Morpher.prototype.updateJoint=function(){
	this.$3d.updateJoint();	
}
Morpher.prototype.bind=function(s){
	this.s2d=s.$2d;
	this.s3d=s.$3d;
	this.scene=this.s3d.getScene();
	this.jointCtrl = new THREE.TransformControls(this.s3d.getCamera(),this.s3d.getRenderer().domElement);
	this.$2d=Morpher2D(this.s2d);
	this.$3d=Morpher3D(this.s3d.getCamera(),this.scene);
	this.s2d.setMorpher(this);
	this.s3d.setMorpher(this);
	this.jointCtrl.setMode("translate");
	this.jointCtrl.setSpace("world");
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