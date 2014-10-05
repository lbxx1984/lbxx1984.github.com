function Transformer(){
	this.$2d=null;
	this.$3d=null;
	this.s2d=null;
	this.s3d=null;
	this.config={
		ondetach:null,
		working:false,
		changing:false,
		meshCtrl:null
	}
}
Transformer.prototype.dragging=function(dMouse2D,dMouse3D){
	this.$2d.moving(dMouse2D,dMouse3D);
	this.config.changing=true;
}
Transformer.prototype.dragover=function(dMouse2D,dMouse3D){
	this.$2d.moved(dMouse2D,dMouse3D);
	this.config.changing=false;
}
Transformer.prototype.attach=function(p){
	if(!p || !p.id || p.id== this.config.mesnCtrl) return;
	this.config.working=true;
	this.config.meshCtrl=p.id;
	this.$3d.attach(p);
	this.$2d.attach(p.id);
	this.s2d.meshSetSelected(p.id);	
	return;
}
Transformer.prototype.detach=function(){
	if(!this.config.working) return;
	this.$3d.detach();
	this.$2d.detach();
	this.s2d.meshClearSelected();
	this.config.meshCtrl=null;
	this.config.working=false;
	this.config.changing=false;
	if(typeof this.config.ondetach=="function") this.config.ondetach();
}
Transformer.prototype.bind=function(s){
	var _this=this;
	this.$3d=Transformer3D(s.$3d);
	this.$2d=Transformer2D(s.$2d);
	this.s2d=s.$2d;
	this.s3d=s.$3d;
	s.$3d.setTransformer(this.$3d);
	s.$2d.setTransformer(this.$2d);	
	this.$3d.onDetach(function(){_this.detach();});
}
Transformer.prototype.setSpace=function(v){
	this.$2d.setSpace(v);
	this.$3d.setSpace(v);	
}
Transformer.prototype.setMode=function(v){
	this.$2d.setMode(v);
	this.$3d.setMode(v);	
}
Transformer.prototype.setSize=function(v){
	if(v>0){
		this.$3d.setSize(this.$3d.getSize()+0.1);
		this.$2d.setSize(Math.min(this.$2d.getSize()+0.1,2));
	}else{
		this.$3d.setSize(Math.max(this.$3d.getSize()-0.1,0.1));
		this.$2d.setSize(Math.max(this.$2d.getSize()-0.1,0.1));
	}
}
Transformer.prototype.setCommand=function(v){
	this.$2d.setCommand(v);
}
Transformer.prototype.getCommand=function(){
	return this.$2d.getCommand();
}
Transformer.prototype.onDetach=function(func){
	this.config.ondetach=func;
}
Transformer.prototype.isWorking=function(){
	return this.config.working;
}
Transformer.prototype.isChanged=function(){
	return this.config.changing;
}				