(function($){
	/*
		tcframe panel
			1、继承自canvas
			2、事件
			3、数据源
				{
					titleHeight:25,
					titleAlign:"left",
					title:"窗口",
					draggable:true
				}
			4、接口
				.enableDrag(boolean)
					
	*/
	$.fn.tPanel = function(param){
		
		var tmpdraggable=false;
		param=param||{};
		if(param.titleHeight==null){param.titleHeight=30;}
		if(param.titleAlign==null){param.titleAlign="left";}
		if(param.title==null){param.title="tPanel";}
		if(param.draggable){tmpdraggable=true;param.draggable=null;}
		var _this=this.tCanvas(param);
			 
		
		
		function init(){		
		
			_this.addClass("tc-panel");
			
			_this.titleBar=$("<div>").tCanvas({
				position:{left:2,top:3,right:4,height:param.titleHeight}	
			})
				.addClass("tc-panel-titleBar")
				.bind("mousedown",function(){
					if(!_this.$draggable){return;}
					_this.draggable({
						stop:function(){_this.draggable("destroy");}
					});		
				});
			
			_this.titleLabel=$("<div>").uicomponent({
				position:{left:5,right:5,top:5,bottom:5}	
			})
				.addClass("tc-panel-title")
				.html(param.title)
				.css("text-align",param.titleAlign);
			
			_this.container=$("<div>").tCanvas({
				position:{left:2,top:2+param.titleHeight,right:4,bottom:4}
			})
				.addClass("tc-panel-container");
			
			if(tmpdraggable){_this.$draggable=true;}
			
			_this.titleBar.add(_this.titleLabel);	
			_this.add(_this.titleBar);
			_this.add(_this.container);
		}
		 	
		////////////////////////接口///////////////////////
		//拖动开关
		_this.enableDrag=function(op){
			_this.$draggable=op;
			return _this;
		}
		
		////////////////////////返回///////////////////////
		init();
		return _this;
	}
})(jQuery);