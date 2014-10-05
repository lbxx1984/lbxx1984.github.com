// JavaScript Document
function Morpher2D(stage){
	
	var _svg=stage.svgContent();
	var _selectColor=stage.getColor("select");
	var _hoverColor=stage.getColor("hover");
	
	var _meshID=null;		//已经选中的物体编号
	var _jointIndex=null;	//已经激活的关节
	var _command=null;		//关节拖动器命令
	var _joints=[];			//物体的各个关节
	var _controller=[];		//关节的拖动器
	var _faceCtrled=[];		//与关节有关的面
	
	var _size=0.5;			//min:0;max:2.
	var _renderSize=50;
	var _floatSize=50;		//finalSize=_renderSize+_size*_floatSize
	
	//清空
	function clear(){
		for(var n=0;n<_joints.length;n++){_joints[n].remove();}
		_joints=[];	
		for(var n=0;n<_controller.length;n++){_controller[n].remove();}
		_controller=[];
	}
	
	//刷新
	function update(){
		//初始化
		var mesh=stage.getMesh(_meshID), joint ,view,faces;
		if(!mesh) return;
		clear();
		//添加关节
		for(var n=0;n<mesh.points.length;n++){
			joint=_svg.circle(mesh.points[n][0],mesh.points[n][1],5).attr({"fill":_selectColor});
			joint[0].index=n;
			joint[0].morpherType="JOINT";
			_joints.push(joint);	
		}
		//添加关节控制器
		if(_jointIndex==null || _jointIndex>=_joints.length) return;
		produceController(mesh.points[_jointIndex][0],mesh.points[_jointIndex][1]);
		//添加关节的控制面
		_faceCtrled=[];
		faces=mesh.faces;
		for(var n=0;n<faces.length;n++){
			if(faces[n].joints[0]==_jointIndex){_faceCtrled.push([n,0]);}
			if(faces[n].joints[1]==_jointIndex){_faceCtrled.push([n,1]);}
			if(faces[n].joints[2]==_jointIndex){_faceCtrled.push([n,2]);}
		}
	}

	//创建控制器
	function produceController(x0,y0){
		var colors=stage.getColor();
		var xh=_svg.path([
			["M",x0,y0+2],
			["L",x0+_renderSize+_size*_floatSize-10,y0+2],
			["L",x0+_renderSize+_size*_floatSize-10,y0+6],
			["L",x0+_renderSize+_size*_floatSize,y0],
			["L",x0+_renderSize+_size*_floatSize-10,y0-6],
			["L",x0+_renderSize+_size*_floatSize-10,y0-2],
			["L",x0,y0-2],
			["M",x0,y0+2]
		]).attr({"fill":colors[0]});
		var yh=_svg.path([
			["M",x0+2,y0],
			["L",x0+2,y0+_renderSize+_size*_floatSize-10],
			["L",x0+6,y0+_renderSize+_size*_floatSize-10],
			["L",x0,y0+_renderSize+_size*_floatSize],
			["L",x0-6,y0+_renderSize+_size*_floatSize-10],
			["L",x0-2,y0+_renderSize+_size*_floatSize-10],
			["L",x0-2,y0],
			["M",x0+2,y0]
		]).attr({"fill":colors[1]});
		var circle=_svg.circle(x0,y0,5).attr({"fill":_hoverColor});	
		circle[0].tcType=yh[0].tcType=xh[0].tcType="M2D";
		xh[0].tcItem="x";
		yh[0].tcItem="y";
		circle[0].tcItem="b";
		xh[0].tcCursor="eResize";
		yh[0].tcCursor="sResize";
		circle[0].tcCursor="move";
		_controller.push(xh);	
		_controller.push(yh);
		_controller.push(circle);	
	}
	
	//拖动处理
	function dragging(d2,d3){
		//预处理
		if(_command=="x"){
			d2[1]=0;	
		}else if(_command=="y"){
			d2[0]=0;
		}
		//移动控制器
		_controller[0].translate(d2[0],d2[1]);
		_controller[1].translate(d2[0],d2[1]);
		_controller[2].translate(d2[0],d2[1]);
		_joints[_jointIndex].translate(d2[0],d2[1]);	
		//修改与关节有关的面
		var mesh,vector,faces,face,p,pathDate,path;
		mesh=stage.getMesh(_meshID);
		vector=mesh.points[_jointIndex];
		faces=mesh.faces;	
		//更新mesh2d的原始信息
		vector[0]+=d2[0];
		vector[1]+=d2[1];
		//更新mesh2d的面
		for(var n=0;n<_faceCtrled.length;n++){
			face=faces[_faceCtrled[n][0]];
			p=_faceCtrled[n][1];
			pathDate=face.pathDate;
			switch(p){
				case 0:pathDate[0]+=d2[0];pathDate[1]+=d2[1];break;
				case 1:pathDate[2]+=d2[0];pathDate[3]+=d2[1];break;
				default:pathDate[4]+=d2[0];pathDate[5]+=d2[1];break;	
			}
			path=[
				["M",pathDate[0],pathDate[1]],
				["L",pathDate[2],pathDate[3]],
				["L",pathDate[4],pathDate[5]],
				["L",pathDate[0],pathDate[1]]
			];
			face.attr({path:path});	
		}			
	}
	
	function dragover(op,np){
		if(_jointIndex==null || _meshID==null ||!op || !np) return;
		var dx=np.x-op.x;
		var dy=np.y-op.y;
		var dz=np.z-op.z;
		var geo=stage.getMesh(_meshID).geo;
		var vector=geo.geometry.vertices[_jointIndex];
		var matrix=tcMath.rotateMatrix(geo);
		var world=tcMath.Local2Global(vector.x,vector.y,vector.z,matrix,geo);
		var local=null;
		var view=stage.getView();
		if(view=="xoz"){
			if(_command=="x"){
				dz=dy=0;
			}else if(_command=="y"){
				dx=dy=0;	
			}
		}else if(view=="xoy"){
			if(_command=="x"){
				dy=dz=0;
			}else if(_command=="y"){
				dx=dz=0;	
			}
		}else{
			if(_command=="x"){
				dz=dx=0;
			}else if(_command=="y"){
				dy=dx=0;	
			}
		}
		world[0]+=dx;
		world[1]+=dy;
		world[2]+=dz;
		local=tcMath.Global2Local(world[0],world[1],world[2],geo);
		vector.x=local[0];
		vector.y=local[1];
		vector.z=local[2];
		geo.geometry.verticesNeedUpdate=true;
		return [dx,dy,dz];
	}
	
	return{
		///////////控制器接口
		update:function(){
			update();
		},
		attach:function(id){
			_meshID=id;
			update();
		},
		detach:function(){
			_meshID=null;
			_jointIndex=null;
			_faceCtrled=[];
			clear();
		},
		attachJoint:function(index){
			_jointIndex=index;
			update();
		},
		detachJoint:function(){
			_jointIndex=null;
			for(var n=0;n<_controller.length;n++){_controller[n].remove();}
			_controller=[];	
		},
		setCommand:function(v){
			_command=v;
		},
		getCommand:function(){
			return _command;	
		},
		dragging:function(d2,d3){
			dragging(d2,d3);
		},
		dragover:function(op,np){
			return dragover(op,np);
		}
	}
}