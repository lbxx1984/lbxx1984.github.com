// JavaScript Document
function JointsController2D(stage){
	
	var _svg=stage.svgContent();
	var _selectColor=stage.getColor("select");
	var _hoverColor=stage.getColor("hover");
	
	var _meshIndex=null;		//已经选中的物体编号
	var _jointHover=null;		//鼠标正经过的关节
	var _jointIndex=null;		//已经选中的关节编号
	var _faceCtrled=[];			//包含选中关节的面的编号和关节在面中的位置
	var _joints=[];				//页面中每个关节对象
	var _jointChanged=false;	//关节是否被移动过
	
	var _onDetach=null;
	
	//清空关节
	function clear(){
		for(var n=0;n<_joints.length;n++){_joints[n].remove();}
		_joints=[];	
	}
	
	//刷新关节
	function update(){
		if(_meshIndex==null) return;
		var mesh=stage.getMesh(_meshIndex);
		if(!mesh) return;
		clear();
		for(var n=0;n<mesh.points.length;n++){
			var joint=
				_svg
				.circle(mesh.points[n][0],mesh.points[n][1],5)
				.attr({"fill":_hoverColor});
			joint[0].index=n;//circle的index代表关节序号
			_joints.push(joint);	
		}	
	}
	
	//挂接物体
	function attach(index){
		_meshIndex=index;
		var mesh=stage.getMesh(index);
		if(!mesh){return;}
		update();
	}
	
	//取消挂接
	function detach(){
		clear();
		_meshIndex=null;
		_jointHover=null;
		_jointIndex=null;
		_faceCtrled=[];
		_joints=[];		
		_jointChanged=false;
		if(_onDetach!=null){_onDetach();}
	}
	
	return{
		
		///////////控制器接口
		update:function(){
			update();
		},
		attach:function(index){
			attach(index);
		},
		detach:function(){
			detach();
		},
		onDetach:function(func){
			_onDetach=func;
		},
		
		///////////关节控制接口
		isJointActive:function(){
			return _jointIndex!=null;
		},
		isJointChanged:function(){
			return _jointChanged;
		},
		jointChange:function(oldpos,newpos){
			if(_jointIndex==null || _meshIndex==null ||!oldpos || !newpos) return;
			var geo=stage.getMesh(_meshIndex).geo;
			var vector=geo.geometry.vertices[_jointIndex];
			var matrix=tcMath.rotateMatrix(geo);
			var world=tcMath.Local2Global(vector.x,vector.y,vector.z,matrix,geo);
			var local=null;
			world[0]+=newpos.x-oldpos.x;
			world[1]+=newpos.y-oldpos.y;
			world[2]+=newpos.z-oldpos.z;
			local=tcMath.Global2Local(world[0],world[1],world[2],geo);
			vector.x=local[0];
			vector.y=local[1];
			vector.z=local[2];
			geo.geometry.verticesNeedUpdate=true;
		},
		jointMove:function(dx,dy){
			if(_meshIndex==null || _jointIndex==null || _faceCtrled.length==0) return;
			//移动关节
			var x=_joints[_jointIndex].attr("cx")+dx;
			var y=_joints[_jointIndex].attr("cy")+dy;
			_joints[_jointIndex].attr({cx:x,cy:y});
			//修改与关节有关的面
			var mesh=stage.getMesh(_meshIndex);
			var vector=mesh.points[_jointIndex];
			var faces=mesh.faces;	
			//更新mesh2d的原始信息
			vector[0]+=dx;
			vector[1]+=dy;
			//更新mesh2d的面
			for(var n=0;n<_faceCtrled.length;n++){
				var face=faces[_faceCtrled[n][0]];
				var p=_faceCtrled[n][1];
				var pathDate=face.pathDate;
				switch(p){
					case 0:pathDate[0]+=dx;pathDate[1]+=dy;break;
					case 1:pathDate[2]+=dx;pathDate[3]+=dy;break;
					default:pathDate[4]+=dx;pathDate[5]+=dy;break;	
				}
				var path=[
					["M",pathDate[0],pathDate[1]],
					["L",pathDate[2],pathDate[3]],
					["L",pathDate[4],pathDate[5]],
					["L",pathDate[0],pathDate[1]]
				];
				face.attr({path:path});	
			}
			_jointChanged=true;	
		},
		jointActive:function(index){
			if(index==null) return;
			_jointIndex=index;
			var mesh=stage.getMesh(_meshIndex);
			var faces=mesh.faces;
			_faceCtrled=[];
			for(var n=0;n<faces.length;n++){
				if(faces[n].joints[0]==_jointIndex){_faceCtrled.push([n,0]);}
				if(faces[n].joints[1]==_jointIndex){_faceCtrled.push([n,1]);}
				if(faces[n].joints[2]==_jointIndex){_faceCtrled.push([n,2]);}
			}
		},
		jointHover:function(index){
			if(index==null ||index >=_joints.length) return;
			if(_jointHover!=null && _jointHover < _joints.length){
				_joints[_jointHover].attr({"fill":_hoverColor});
				_jointHover=null;	
			}
			if(index<0) return;
			_jointHover=index;
			_joints[_jointHover].attr({"fill":_selectColor});	
		}
	}
}