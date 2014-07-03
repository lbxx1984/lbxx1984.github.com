(function($){
	/*
		tcframe canvas
			1、继承自uicomponent
			2、增加滚动条
			3、增加子元素接口
			4、数据源
				{
					scrollbar:{ 
						wheelSpeed: 20,
						wheelPropagation: true,
  						minScrollbarLength: 20
					}
				}
			5、接口
				.enableScroll(boolean)
				.scrollTo(integer,boolean)
				.add(jQuery|DOM)
				.del(jQuery|DOM)
				.removeAll()
					
	*/
	$.fn.tCanvas = function(param){
		
			
		var _children=[];
		var _this=this.uicomponent(param);
			_this.$scrollbar=false;
			 param=param||{};
		
		
		
		function init(){
			_this.addClass("tc-canvas");
			_this.enableScroll(param.scrollbar);
			
		}
		 	
			
		////////////////////////接口///////////////////////
		
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
			//更新滚动条
			if(_this.$scrollbar){
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
					//移除jQuery元素
					if(typeof(e.display)=='function'){
						//tc元素的反显示|移除
						e.display(false);
						setTimeout(function(){_this[0].removeChild(e[0]);},100);
					}else{
						_this[0].removeChild(e[0]);
					}
					
				}else{
					//移除DOM元素
					_this[0].removeChild(e);	
				}
				//更新children数组
				var arr=[];
				for(var n=0;n<_children.length;n++){
					if(_children[n]!=e){arr.push(_children[n]);}	
				}
				_children=arr;
				//更新滚动条
				if(_this.$scrollbar){
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
			if(!_this.$display){return _this;}
			//刷新子容器	
			if(_children.length>0){
				for(var n=0;n<_children.length;n++){
					if(_children[n].jquery!=null||typeof(_children[n].render)=="function"){
						_children[n].render();	
					}	
				}	
			}	
			//刷新滚动条
			if(_this.$scrollbar){
				_this.perfectScrollbar("update");
			}
			return _this;
		}
	
	
		////////////////////////返回///////////////////////
		init();
		return _this;
	}
})(jQuery);