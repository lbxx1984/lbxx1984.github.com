// JavaScript Document
function Mesh2D(param){
	this.geo=param.geo;
	this.displayType=param.type;
	this.width=param.width;
	this.height=param.height;
	this.offset=param.offset;
	this.scale=param.scale;
	this.paper=param.paper;
	this.meshColor=param.meshColor;
	this.center=[0,0];
	this.points=[];
	this.faces=[];
	this.createPoints();
	this.createFaces();
}
Mesh2D.prototype.reset=function(color){
	for(var n=0;n<this.faces.length;n++){this.faces[n].remove();}
	this.points=[];
	this.faces=[];
	this.center=[0,0];
	this.createPoints();
	this.createFaces();
	if(color) this.changeColor(color);
}
Mesh2D.prototype.translate=function(dx,dy){
	for(var n=0;n<this.faces.length;n++){
		this.faces[n].translate(dx,dy);	
	}
}
Mesh2D.prototype.rotate=function(a){
	for(var n=0;n<this.faces.length;n++){
		this.faces[n].rotate(a,this.center[0],this.center[1]);	
	}	
}
Mesh2D.prototype.remove=function(){
	for(var n=0;n<this.faces.length;n++){this.faces[n].remove();}
}
Mesh2D.prototype.changeColor=function(color){
	for(var n=0;n<this.faces.length;n++){this.faces[n].attr({stroke:color});}	
}
Mesh2D.prototype.createFaces=function(){
	var points=this.points;
	var paper=this.paper;
	var faces=this.geo.geometry.faces;
	for(var n=0;n<faces.length;n++){
		var face=
		paper
		.path([
			["M",points[faces[n].a][0],points[faces[n].a][1]],
			["L",points[faces[n].b][0],points[faces[n].b][1]],
			["L",points[faces[n].c][0],points[faces[n].c][1]],
			["L",points[faces[n].a][0],points[faces[n].a][1]]
		])
		.attr({"stroke-width":1,stroke:this.meshColor,"stroke-linejoin":"round"});
		face[0].geoID=this.geo.id;
		//为面添加控制点编号，以便通过修改点来修改面结构
		face.joints=[faces[n].a,faces[n].b,faces[n].c];
		face.pathDate=[
			points[faces[n].a][0],points[faces[n].a][1],
			points[faces[n].b][0],points[faces[n].b][1],
			points[faces[n].c][0],points[faces[n].c][1]
		];
		this.faces.push(face);
	}		
}
Mesh2D.prototype.createPoints=function(){
	var matrix=tcMath.rotateMatrix(this.geo);
	this.center=this.RectangularToDisplay(tcMath.Local2Global(0,0,0,matrix,this.geo));
	for(var n=0;n<this.geo.geometry.vertices.length;n++){
		this.points.push(
			this.RectangularToDisplay(
				tcMath.Local2Global(
					this.geo.geometry.vertices[n].x,
					this.geo.geometry.vertices[n].y,
					this.geo.geometry.vertices[n].z,
					matrix,
					this.geo
				)
			)
		);
	}	
}
Mesh2D.prototype.RectangularToDisplay=function(pos){
	var x=0,y=0;
	if(this.displayType=="xoz"){
		x=pos[0];y=pos[2];
	}else if(this.displayType=="xoy"){
		x=pos[0];y=pos[1];
	}else if(this.displayType=="yoz"){
		x=pos[1];y=pos[2];
	}
	x=this.width*0.5+(x+this.offset.x)/this.scale;
	y=this.height*0.5-(y+this.offset.y)/this.scale;
	return [x,y];	
}
Mesh2D.prototype.DisplayToRectangular=function(dx,dy){
	dy=-dy;	
	dy=dy*this.scale-this.offset.y;
	dx=dx*this.scale-this.offset.x;
	if(this.displayType=="xoz"){
		return [dx,0,dy];
	}else if(this.displayType=="xoy"){
		return [dx,dy,0];
	}else if(this.displayType=="yoz"){
		return [0,dx,dy];
	}
}