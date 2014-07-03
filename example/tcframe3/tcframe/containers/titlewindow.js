(function($){
	/*
		tcframe titlewindow
			1、继承自panel
			2、事件
				close 
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
	$.fn.tTitleWindow = function(param){
		
		if(param.titleHeight==null){param.titleHeight=30;}
		if(param.titleAlign==null){param.titleAlign="left";}
		if(param.title==null){param.title="TitleWindow";}
		if(param.draggable){tmpdraggable=true;param.draggable=null;}
		
		var _this=this.tPanel(param);
		
		function init(){		
			
			_this.titleBar.add(
				$("<div>").tButton({
					label:"×",
					position:{right:7,top:5,width:18,height:18}
				})
				.bind("click",function(){
					_this.trigger("close");
				})
			);
			
		}
		 	
		////////////////////////接口///////////////////////
		
		////////////////////////返回///////////////////////
		init();
		return _this;
	}
})(jQuery);