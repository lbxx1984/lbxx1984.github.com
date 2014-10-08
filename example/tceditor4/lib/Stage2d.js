// JavaScript Document
(function($){$.fn.Stage2D = function(param){
		
		
	/***内部参数***/
	//组件参数
	var _this		=this;
	var _children	=null;	//stage3d里的children
	var _meshes		={};	//存放封装好的2D物体		
	//舞台参数
	var _width		=param.width;
	var _height		=param.height;
	var _showGrid	=(param.showGrid==null)?false:true;
	var _gridColor	=(param.gridColor==null)?"#ffffff":param.gridColor;
	var _meshColor	=(param.meshColor==null)?"#F0F0F0":param.meshColor;
	var _meshSelectColor	=(param.meshSelectColor==null)?"#D97915":param.meshSelectColor;
	var _meshHoverColor		=(param.meshHoverColor==null)?"yellow":param.meshHoverColor;
	//绘制辅助信息
	var _type		="xoz";
	var _scale		=parseInt(param.scale)||3;
	var _offset		={x:0,y:0};
	var _cellSize	=50;
	var _needRendering =false;
	//鼠标参数
	var _mouse		=new THREE.Vector3();
	//辅助插件
	var _canvas		=document.createElement("canvas");
	var _paper 		=document.createElement("div");
	var _content	=null;
	var _svgContent	=null;
	var _morpher	=null;
	var _selector	=null;
	//物体参数
	var _meshHover=null;
	var _meshSelected=null;
	//自定义事件
	var _event={};
	

	/***初始化2D场景***/
	_canvas.width=_width;
	_canvas.height=_height;
	_context=_canvas.getContext("2d");
	this[0].appendChild(_canvas);
	_paper.style.position="absolute";
	_paper.style.width=_width+"px";
	_paper.style.height=_height+"px";
	_paper.style.top="0px";
	_paper.style.left="0px";
	this[0].appendChild(_paper);
	_svgContent=Raphael(_paper,_width,_height);
	grid();


	/***内部处理事件***/
	_this
	.bind("mousemove",function(e){
		var pos=_this.offset();			
		var x=(e.clientX-pos.left-_width*0.5)*_scale-_offset.x;
		var y=(_height*0.5-e.clientY+pos.top-document.body.scrollTop)*_scale-_offset.y;
		var mouse3d=new THREE.Vector3();
		if(_type=="xoz"){
			mouse3d.x=x;mouse3d.z=y;
		}else if(_type=="xoy"){
			mouse3d.x=x;mouse3d.y=y;
		}else if(_type=="yoz"){
			mouse3d.y=x;mouse3d.z=y;
		}
		_mouse=mouse3d.clone();
	});


	/***辅助函数***/
	//清空物体
	function clear(){
		for(var key in _meshes){
			_meshes[key].remove();
			delete _meshes[key];
		}	
	}
	//绘制物体
	function render(){
		clear();
		for(var key in _children){
			if(!_children[key].visible) continue;
			_meshes[key]=new Mesh2D({
				geo:_children[key],
				type:_type,
				width:_width,
				height:_height,
				offset:_offset,
				scale:_scale,
				paper:_svgContent,
				meshColor:_meshColor
			});	
		}
		_meshHover=null;
		if(_meshes[_meshSelected]) _meshes[_meshSelected].changeColor(_meshSelectColor);	
	}
	//绘制辅助网格
	function grid(){
		var x0=0,y0=0,step,x,y,color1,color2;
		x0=_offset.x/_scale+_width*0.5;
		y0=_height*0.5-_offset.y/_scale;
		step=_cellSize/_scale;
		if(_type=="xoz"){
			color1="#ff0000";color2="#4285F4";	
		}else if(_type=="xoy"){
			color1="#ff0000";color2="#3E9B1C";
		}else{
			color1="#3E9B1C";color2="#4285F4";
		}
		//清空
		_context.clearRect(0,0,_width,_height);
		if(!_showGrid) return;
		//绘制表格
		_context.beginPath();
		_context.strokeStyle=_gridColor;
		_context.lineWidth=0.5;
		x=x0;while(x<=_width){_context.moveTo(x+0.5,0.5);_context.lineTo(x+0.5,_height+0.5);x+=step;}
		x=x0-step;while(x>=0){_context.moveTo(x+0.5,0.5);_context.lineTo(x+0.5,_height+0.5);x-=step;}
		y=y0;while(y<=_height){_context.moveTo(0.5,y+0.5);_context.lineTo(_width+0.5,y+0.5);y+=step;}
		y=y0-step;while(y>=0){_context.moveTo(0.5,y+0.5);_context.lineTo(_width+0.5,y+0.5);y-=step;}
		_context.stroke();
		//绘制坐标轴
		_context.beginPath();
		if(x0>0){
			_context.strokeStyle=color2;
			_context.lineWidth=2;
			_context.moveTo(x0+0.5,0.5);
			_context.lineTo(x0+0.5,_height+0.5);
		}
		_context.stroke();
		_context.beginPath();
		if(x0>0){
			_context.strokeStyle=color1;
			_context.lineWidth=2;
			_context.moveTo(0.5,y0+0.5);
			_context.lineTo(_width+0.5,y0+0.5);
		}
		_context.stroke();
	}
	
	//输出摄像机位置
	function ouputCamera(){
		if(!_event["onCameraChange"]) return;
		var pos={x:9999,y:9999,z:9999};
		var lookAt={x:0,y:0,z:0};
		var r={r:6-_scale,b:6,a:0.5};
		if(_type=="xoz"){
			lookAt.x=pos.x=-_offset.x;
			lookAt.z=pos.z=-_offset.y;
		}else if(_type=="xoy"){
			lookAt.x=pos.x=-_offset.x;
			lookAt.y=pos.y=-_offset.y;
		}else if(_type=="yoz"){
			lookAt.y=pos.y=-_offset.x;
			lookAt.z=pos.z=-_offset.y;
		}
		_event["onCameraChange"](pos,lookAt,r);		
	}
	
	
	/***外部接口***/
	//物体操作接口
	_this.meshFresh=function(geo){
		if(_meshes[geo.id]){
			_meshes[geo.id].remove();
			delete _meshes[geo.id];
			_meshes[geo.id]=new Mesh2D({
				geo:geo,
				type:_type,
				width:_width,
				height:_height,
				offset:_offset,
				scale:_scale,
				paper:_svgContent,
				meshColor:_meshColor
			});	
			if(geo.id==_meshSelected) _meshes[geo.id].changeColor(_meshSelectColor);
			_morpher.update();
			_selector.update();
		}
	}
	_this.meshVisible=function(id,value,geo){
		if(!value){
			if(_meshes[id]){
				_meshes[id].remove();
				delete _meshes[id];
			}
		}else{
			_meshes[id]=new Mesh2D({
				geo:geo,
				type:_type,
				width:_width,
				height:_height,
				offset:_offset,
				scale:_scale,
				paper:_svgContent,
				meshColor:_meshColor
			});		
		}
	}
	_this.meshHover=function(id){
		if(id==_meshHover) return;
		if(_meshes[_meshHover]){
			if(_meshHover==_meshSelected){
				_meshes[_meshHover].changeColor(_meshSelectColor);
			}else{
				_meshes[_meshHover].changeColor(_meshColor);
			}
		}
		if(id == null){
			_meshHover=null;
			return;
		}
		_meshHover=id;
		if(_meshes[_meshHover]){
			_meshes[_meshHover].changeColor(_meshHoverColor);
		}
	}
	_this.meshClearSelected=function(){
		if(_meshSelected==null) return;
		if(_meshes[_meshSelected]) _meshes[_meshSelected].changeColor(_meshColor);
		_meshSelected=null;	
	}
	_this.meshSetSelected=function(id){
		if(id==null || id==_meshSelected) return;
		if(!_meshes[id]){_meshSelected=id;return;}//舞台还没渲染，先只保存ID
		_this.meshClearSelected();
		_meshSelected=id;
		_meshes[_meshSelected].changeColor(_meshSelectColor);
	}
	_this.getMesh=function(id){
		return _meshes[id];	
	}
	_this.deleteMesh=function(id){
		if(_meshes[id]){
			_meshes[id].remove();
			delete 	_meshes[id];
		}
	}
	//舞台信息接口
	_this.svgContent=function(){
		return _svgContent;	
	}
	_this.needRendering=function(){
		return _needRendering;
	}
	_this.getMousePosition=function(){
		return _mouse.clone();
	}
	_this.bindStage=function(stage){
		_children=stage.children();
	}
	_this.changeView=function(view){
		_type=view;
		_this.fresh();
		ouputCamera();
	}
	_this.getView=function(){
		return _type;	
	}
	_this.getColor=function(type){
		if(type=="select") return _meshSelectColor;	
		if(type=="hover") return _meshHoverColor;
		if(!type){
			if(_type=="xoz"){
				return ["#ff0000","#4285F4"];	
			}else if(_type=="xoy"){
				return ["#ff0000","#3E9B1C"];
			}else{
				return ["#3E9B1C","#4285F4"];
			}	
		}
	}
	_this.resize=function(width,height){
		_canvas.width=_width=width;
		_canvas.height=_height=height;
		_paper.style.width=_width+"px";
		_paper.style.height=_height+"px";
		_this.fresh();
	}
	//舞台渲染接口
	_this.fresh=function(dontFreshMesh){
		grid();
		if(dontFreshMesh){
			clear();
			_needRendering=true;
			return;
		}
		_needRendering=false;
		render();
		if(_morpher) _morpher.update();
		if(_selector) _selector.update();
	}
	//摄像机接口
	_this.lookAt=function(dx,dy,dontFreshMesh){
		_offset.x+=dx*_scale;
		_offset.y+=dy*_scale;
		_this.fresh(dontFreshMesh);
		ouputCamera();
	}
	_this.zoomTo=function(v){
		_offset.x=_offset.x/_scale;
		_offset.y=_offset.y/_scale;
		_scale=6-v;
		if(_scale<0.5) _scale=0.5;
		if(_scale>6) _scale=6;
		_offset.x=_offset.x*_scale;
		_offset.y=_offset.y*_scale;
		_this.fresh();
		ouputCamera();	
	}
	_this.zoomCamara=function(a){
		_offset.x=_offset.x/_scale;
		_offset.y=_offset.y/_scale;
		if(a){
			_scale=Math.max(_scale-0.5,0.5);
		}else{
			_scale=Math.min(_scale+0.5,6);
		}
		_offset.x=_offset.x*_scale;
		_offset.y=_offset.y*_scale;
		_this.fresh();
		ouputCamera();
	}
	//辅助器接口
	_this.toggleAxis=function(){
		_showGrid=!_showGrid;
		if(_showGrid){
			grid();
		}else{
			_context.clearRect(0,0,_width,_height);
		}
	}
	_this.resizeGrid=function(a){
		if(a){
			_cellSize=Math.min(_cellSize*2,400)
		}else{
			_cellSize=Math.max(_cellSize/2,25);
		}
		grid();
	}
	_this.setGridColor=function(e){
		_gridColor=e;
		grid();	
	}
	_this.setMorpher=function(c){
		_morpher=c;
	}
	_this.setTransformer=function(c){
		_selector=c;	
	}
	//事件接口
	_this.addListener=function(type,func){
		_event[type]=func;	
	}
	_this.removeListener=function(type){
		_event[type]=null;	
	}
	return _this;
}})(jQuery);