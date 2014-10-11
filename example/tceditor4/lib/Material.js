function Material(){
	this.children={};	
}
Material.prototype.load=function(arr){
	if(!(arr instanceof Array)) return;
	this.children={};
	for(var n=0;n<arr.length;n++){
		this.children[arr[n].id]=new THREE[arr[n].type](arr[n]);
	}
}
Material.prototype.get=function(key){
	var a=this.children[key].clone();
	a.name=key;
	return a;
}