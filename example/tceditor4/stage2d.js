// JavaScript Document
(function($){

	$.fn.stage2D = function(param){
		
		_this=this;
		_this
			.css({position:"absolute","background-color":param.clearColor})
			.css({left:"0px",top:-param.height+"px",width:param.width+"px",height:param.height+"px"})
		
		
		var _paper = Raphael(_this[0],param.width,param.height);
		var _grid=[];
		var _children=[];
		var _type="XOZ";
		var _scale=parseInt(param.scale)|| 3;
		var _offset={x:0,y:0};
		var _gridStep=50;
		var _objects=[];
		var _mouse=new THREE.Vector3();
		var _showGrid=true;
		
		_this.bind("mousemove",function(e){
			var x=e.clientX;
			var y=e.clientY;
			var mouse3d=new THREE.Vector3();
			
			x=x-param.width*0.5;
			y=param.height*0.5-y;
			x=x*_scale-_offset.x;
			y=y*_scale-_offset.y;
			
			if(_type=="XOZ"){
				mouse3d.x=x;mouse3d.z=y;
			}else if(_type=="XOY"){
				mouse3d.x=x;mouse3d.y=y;
			}else if(_type=="YOZ"){
				mouse3d.y=x;mouse3d.z=y;
			}

			_this.trigger("mouse3Dchange",[mouse3d]);	
		})
		
		addGrid();
		
		
		
		function render(arr){
			//clearStage
			if(_children.length>0){
				for(var n=0;n<_children.length;n++){
					for(var m=0;m<_children[n].length;m++){_children[n][m].remove();}
				}
			}
			//addGeo
			for(var n=0;n<arr.length;n++){addGeometry(arr[n]);}
		}
		
		function addGeometry(obj){
			var matrix=tcMath.rotateMatrix(obj),points=[],lines=[];
			for(var n=0;n<obj.geometry.vertices.length;n++){
				var pos=tcMath.Local2Global(
					obj.geometry.vertices[n].x,
					obj.geometry.vertices[n].y,
					obj.geometry.vertices[n].z,
					matrix,obj);
				pos=RectangularToDisplay(pos);
				points.push(pos);
			}
			for(var n=0;n<obj.geometry.faces.length;n++){
				var face3d=obj.geometry.faces[n];
				var path=[
					["M",points[face3d.a][0],points[face3d.a][1]],
					["L",points[face3d.b][0],points[face3d.b][1]],
					["L",points[face3d.c][0],points[face3d.c][1]],
					["L",points[face3d.a][0],points[face3d.a][1]]
				];
				lines.push(_paper.path(path).attr({stroke:"#FFAA00"}));
			}
			_children.push(lines);	
		}
		
		function addGrid(hide){
			if(_grid.length>0){
				for(var n=0;n<_grid.length;n++){_grid[n].remove();}
				_grid=[];
			}
			
			if(hide==false){return;}
			
			var x0=0,y0=0,step,x,y,color1,color2;
			x0=(x0+_offset.x)/_scale;
			y0=(y0+_offset.y)/_scale;
			x0=x0+param.width*0.5;
			y0=param.height*0.5-y0;
			step=_gridStep/_scale;
			
			x=x0;
			while(x<=param.width){
				_grid.push(
					_paper.path([
						["M",x+0.5,0.5],
						["L",x+0.5,param.height+0.5]
					]).attr({stroke:param.gridColor})	
				);
				x+=step;	
			}
			x=x0;
			while(x>=0){
				_grid.push(
					_paper.path([
						["M",x+0.5,0.5],
						["L",x+0.5,param.height+0.5]
					]).attr({stroke:param.gridColor})	
				);
				x-=step;	
			}
			y=y0;
			while(y<=param.height){
				_grid.push(
					_paper.path([
						["M",0.5,y+0.5],
						["L",param.width+0.5,y+0.5]
					]).attr({stroke:param.gridColor})	
				);
				y+=step;	
			}
			y=y0;
			while(y>=0){
				_grid.push(
					_paper.path([
						["M",0.5,y+0.5],
						["L",param.width+0.5,y+0.5]
					]).attr({stroke:param.gridColor})	
				);
				y-=step;	
			}
			if(_type=="XOZ"){
				color1="#ff0000";
				color2="#4285F4";	
			}else if(_type=="XOY"){
				color1="#ff0000";
				color2="#3E9B1C";
			}else{
				color1="#3E9B1C";
				color2="#4285F4";
			}
			if(x0>0){
				_grid.push(
					_paper.path([
						["M",x0+0.5,0.5],
						["L",x0+0.5,param.height+0.5]
					]).attr({stroke:color2,"stroke-width":2})	
				);	
			}
			if(y0>0){
				_grid.push(
					_paper.path([
						["M",0.5,y0+0.5],
						["L",param.width+0.5,y0+0.5]
					]).attr({stroke:color1,"stroke-width":2})	
				);	
			}
		}
		
		
		////辅助函数
		//直角坐标系映射到笛卡尔坐标系
		function RectangularToDisplay(pos){
			var x=0,y=0;
			if(_type=="XOZ"){
				x=pos[0];y=pos[2];
			}else if(_type=="XOY"){
				x=pos[0];y=pos[1];
			}else if(_type=="YOZ"){
				x=pos[1];y=pos[2];
			}
			x=(x+_offset.x)/_scale;
			y=(y+_offset.y)/_scale;
			x=x+param.width*0.5;
			y=param.height*0.5-y;
			return [x,y];
		}
		
		
		
		
		////对外接口
		_this.resize=function(width,height){
			param.width=width;
			param.height=height;
			_this.css({width:width+"px",height:height+"px"});
			addGrid();
		}
		_this.render=function(arr,type){
			if(_type!=type){_type=type;addGrid();}
			if(!arr||!arr.length){return;}
			_objects=arr;
			render(arr);	
		}
		_this.fresh=function(){
			addGrid();
			if(!_objects.length){return;}
			render(_objects);	
		}
		_this.offset=function(obj){
			if(obj==null){return;}
			if(obj.x!=null){_offset.x+=obj.x*_scale;}
			if(obj.y!=null){_offset.y+=obj.y*_scale;}
		}
		_this.zoomCamara=function(a){
			if(a){
				_scale-=0.2;
				if(_scale<0.2){_scale=0.2;}
			}else{
				_scale+=0.2;
				if(_scale>10){_scale=10;}
			}
		}
		_this.resizeGrid=function(a){
			if(a){
				_gridStep*=2;
				if(_gridStep>400){_gridStep=400;}
			}else{
				_gridStep/=2;
				if(_gridStep<25){_gridStep=25;}
			}
			addGrid();
		}
		_this.toggleAxis=function(){
			_showGrid=!_showGrid;
			if(_showGrid){
				for(var n=0;n<_grid.length;n++){_grid[n].show();}
			}else{
				for(var n=0;n<_grid.length;n++){_grid[n].hide();}
			}
		}
		return _this;
	}	
})(jQuery);