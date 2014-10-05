// JavaScript Document

function Transformer2D(stage){
	
	
	var _svg=stage.svgContent();
	var _onChange=null;
	var _onDetach=null;
	var _mode="translate";	//translate,rotate,scale
	var _command=null;
	var _size=0.5;			//min:0;max:2.
	var _renderSize=50;
	var _floatSize=50;		//finalSize=_renderSize+_size*_floatSize
	var _meshID=null;	
	var _help=[];			//显示在svg中的控制元件
	
		
	var _producer={
		"translate":function(center){
			var colors=stage.getColor(),x0=center[0],y0=center[1],hoverColor=stage.getColor("hover");
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
			var circle=_svg.circle(x0,y0,5).attr({"fill":hoverColor});
			//
			_help.push(xh);	
			_help.push(yh);
			_help.push(circle);	
			//
			circle[0].tcType=yh[0].tcType=xh[0].tcType="T2D";
			xh[0].tcItem="x";
			yh[0].tcItem="y";
			circle[0].tcItem="b";
			xh[0].tcCursor="eResize";
			yh[0].tcCursor="sResize";
			circle[0].tcCursor="move";	
		},
		"rotate":function(center){
			//TODO
		},
		"scale":function(center){
			//TODO
		}
	}
	
	
	var _moving={
		"translate":function(dMouse2d, dMouse3d){
			var mesh=stage.getMesh(_meshID);
			if(!mesh || !_command) return;
			if(_command=="x"){
				dMouse2d[1]=0;	
			}else if(_command=="y"){
				dMouse2d[0]=0;
			}
			mesh.translate(dMouse2d[0],dMouse2d[1]);
			_help[0].translate(dMouse2d[0],dMouse2d[1]);
			_help[1].translate(dMouse2d[0],dMouse2d[1]);
			_help[2].translate(dMouse2d[0],dMouse2d[1]);
		},
		"rotate":function(dMouse2d, dMouse3d){
			//TODO
		},
		"scale":function(dMouse2d, dMouse3d){
			//TODO
		}
	}
	
	
	var _moved={
		"translate":function(dMouse2d, dMouse3d){
			var mesh=stage.getMesh(_meshID);
			if(!mesh) return;
			var dx=dMouse3d[0];
			var dy=dMouse3d[1];
			var dz=dMouse3d[2];
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
			mesh.geo.position.x=mesh.geo.position.x+dx;
			mesh.geo.position.y=mesh.geo.position.y+dy;
			mesh.geo.position.z=mesh.geo.position.z+dz;
			mesh.reset(stage.getColor("select"));
			update();
		},
		"rotate":function(dMouse2d, dMouse3d){
			//TODO
		},
		"scale":function(dMouse2d, dMouse3d){
			//TODO
		}
	}
	
	
	function clear(){
		for(var n=0;n<_help.length;n++) _help[n].remove();
		_help=[];	
	}
	function detach(){
		clear();
		_meshID=null;
		_command=null;
		if(_onDetach){_onDetach();}		
	}
	function attach(id){
		_meshID=id;
		var mesh=stage.getMesh(id);
		if(!mesh) return;
		update();
	}
	function update(){
		if(_meshID==null) return;
		var mesh=stage.getMesh(_meshID);
		if(!mesh) return;
		clear();
		_mode="translate";
		_producer[_mode](mesh.center);
	}
	
	
	return{
		update:function(){
			update();
		},
		detach:function(){
			detach();
		},
		attach:function(id){
			attach(id);
		},
		moving:function(dMouse2d, dMouse3d){
			_moving[_mode](dMouse2d,dMouse3d);
		},
		moved:function(dMouse2d, dMouse3d){
			_moved[_mode](dMouse2d, dMouse3d);
			_command=null;		
		},
		setCommand:function(value){
			_command=value;
		},
		getCommand:function(){
			return _command;	
		},
		setMode:function(value){
			_mode=value;
			update();
		},
		setSize:function(value){
			_size=value;
			update();	
		},
		setSpace:function(value){
			//todo
		},
		getSize:function(){
			return _size;
		},
		onDetach:function(func){
			_onDetach=func;
		},
		onChange:function(func){
			_onChange=func;
		}
	}
}