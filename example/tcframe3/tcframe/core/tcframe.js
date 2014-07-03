(function($){
	/*
		tcframe
			1、数据源
				{
					position:{left:50,right:50,top:50,bottom:50},
					draggable:{},//jQuery-ui.draggable
					scrollbar:{ 
						wheelSpeed: 20,
						wheelPropagation: true,
  						minScrollbarLength: 20
					}
				}
			2、接口
				.enableDrag(boolean)
				.enableScroll(boolean)
				.scrollTo(integer,boolean)
				.setPosition(position,animationSpeed,callbackFunc)
				.add(jQuery|DOM)
				.del(jQuery|DOM)
				.removeAll()
				.refresh()	
	*/
	$.fn.tcFrame = function(param){
		
		var _this=this;
		var _children=[];
			param=param||{};
			_this.$draggable=false;
			_this.$scrollbar=false;
		
		function init(){
			_this.addClass("tc-frame");
			_this.enableDrag(param.draggable);
			_this.enableScroll(param.scrollbar);
			if( param.position ){
				if(param.position.x!=null){_this.css("left",param.position.x+"px");}
				if(param.position.y!=null){_this.css("top",param.position.y+"px");}
				if(param.position.width!=null){_this.css("width",param.position.width+"px");}
				if(param.position.height!=null){_this.css("height",param.position.height+"px");}
				if(param.scrollbar){
					_this.perfectScrollbar("update");
				}
			}
		}
				



		////////////////////////接口///////////////////////
		
		//拖动开关
		_this.enableDrag=function(op){
			if(!op){
				if(!_this.$draggable){return _this;}
				_this.$draggable=false;
				_this.draggable("destroy");
			}else{
				if(_this.$draggable){return _this;}
				if(typeof(op)=="object"){param.draggable=op;}
				_this.$draggable=true;
				_this.draggable(param.draggable);
			}
			return _this;
		}
		
		//滚动条开关
		_this.enableScroll=function(op){
			if(!op){
				if(!_this.$scrollbar){return _this;}
				_this.$scrollbar=false;
				_this.perfectScrollbar("destroy");		
			}else{
				if(_this.$scrollbar){return _this;}
				if(typeof(op)=="object"){param.scrollbar=op;}
				_this.$scrollbar=true;
				_this.perfectScrollbar(param.scrollbar);
				_this.perfectScrollbar("update");
			}
			return _this;
		}
		
		//滚动条赋值
		_this.scrollTo=function(v,d){
			if(!_this.$scrollbar || v==null){return _this;}
			if(d){
				_this.scrollLeft(v);	
			}else{
				_this.scrollTop(v);
			}
			_this.perfectScrollbar("update");
		}
		
		//设置容器位置和尺寸
		_this.setPosition=function(e,anm,callback){
			if(!e){return _this;}
			if(anm==null){
				if(e.x!=null){_this.css("left",e.x+"px");}
				if(e.y!=null){_this.css("top",e.y+"px");}
				if(e.width!=null){_this.css("width",e.width+"px");}
				if(e.height!=null){_this.css("height",e.height+"px");}
				_this.refresh();
			}else{
				var obj={};
				if(e.x!=null){obj.left=e.x+"px";}
				if(e.y!=null){obj.top=e.y+"px";}
				if(e.width!=null){obj.width=e.width+"px";}
				if(e.height!=null){obj.height=e.height+"px";}
				_this.animate(obj,anm,null,function(){
					if(typeof(callback)=="function"){
						callback();	
					}
					_this.refresh();
				});	
			}
			return _this;
		}
			
		//添加子元素，可以是jQuery元素或DOM元素
		_this.add=function(e){
			if(!e){return _this;}
			_children.push(e);
			if(e.jquery!=null){
				//添加jQuery元素
				_this[0].appendChild(e[0]);
				//如果是tc元素，内部渲染
				if(typeof(e.display)=='function'){
					//渲染|显示
					e.$parent=_this;
					e.render();
					e.display(true);
				}
			}else{
				//添加DOM元素
				_this[0].appendChild(e);	
			}	
			if(param.scrollbar){
				//更新滚动条
				setTimeout(function(){
					_this.perfectScrollbar("update");
				},200);
			}
			return _this;
		}
		
		//删除子元素，可以是jQuery元素或DOM元素
		_this.del=function(e){
			if(!e){return _this;}	
			try{
				if(e.jquery!=null){
					if(typeof(e.display)=='function'){
						e.display(false);
						setTimeout(function(){_this[0].removeChild(e[0]);},100);
					}else{
						_this[0].removeChild(e[0]);
					}
					
				}else{
					_this[0].removeChild(e);	
				}
				//更新children数组
				var arr=[];
				for(var n=0;n<_children.length;n++){
					if(_children[n]!=e){arr.push(_children[n]);}	
				}
				_children=arr;
				//更新滚动条
				if(param.scrollbar){
					setTimeout(function(){
						_this.perfectScrollbar("update");
					},100);
				}
			}catch(err){
				//Todo	
			}
			return _this;
		}
		
		//删除所有子元素
		_this.removeAll=function(){
			while(_children.length>0){
				_this.del(_children[0]);
				_children.shift();	
			}
		}
		
		//刷新
		_this.refresh=function(){
			//刷新子容器	
			if(_children.length>0){
				for(var n=0;n<_children.length;n++){
					if(_children[n].jquery!=null||typeof(_children[n].render)=="function"){
						_children[n].render();	
					}	
				}	
			}	
			//刷新滚动条
			if(param.scrollbar){
				_this.perfectScrollbar("update");
			}
			return _this;
		}
		
		////////////////////////////////返回/////////////////////////////////////
		init();
		return _this;
	}
})(jQuery);