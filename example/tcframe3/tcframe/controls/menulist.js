(function($){
	/*
		tcframe menulist
			1、继承自canvas
			2、事件
				itemMouseEnter
				itemMouseLeave
				itemClick
			3、数据源
			{
				position:{x:50,y:50,width:200},
				itemHeight:30,
				children:[
					{
						id:"1",
						label:"新建",
						hotkey:"Ctrl+N",
						children:[]
					},{
						id:"2",
						label:"打开",
						hotkey:"Ctrl+O"
					},{
						id:"3",
						label:"保存",
						hotkey:"Ctrl+S"
					},{
						id:"4",
						label:"关闭",
						hotkey:"Ctrl+W"
					}
				]
			}
			4、接口
				.dataprovider(array)
				.getItemById(id)
					
	*/
	$.fn.tMenuList = function(param){
		
		param=param||{};
		if(param.position==null){param.position={width:200};}
		if(param.itemHeight==null){param.itemHeight=30;}
		if(param.children&&param.children.length){param.position.height=(param.itemHeight+2)*param.children.length}
		
		_this=this.tCanvas(param);
		var items=[];
		
		function init(){
			
			_this.addClass("tc-menulist");	
			_this.dataprovider(param.children);			
		
		}
		
		//接口
		
		_this.getItemById=function(id){
			if(items.length==0){return null;}
			for(var n=0;n<items.length;n++){
				if(items[n].id==id){return items[n];}	
			}
			return null;
		}
		
		_this.dataprovider=function(arr){
			
			if(!arr||!arr.length){return _this;}
			_this.removeAll();
			items=[];
			
			for(var n=0;n<arr.length;n++){
				arr[n].position={x:0,y:n*(param.itemHeight+2),width:param.position.width-2,height:param.itemHeight}
				var item=$("<div>").tMenuItem(arr[n]);
					item[0].index=n;
					item
					.bind("mouseenter",function(){
						_this.trigger("itemMouseEnter",[items[this.index]]);
					})
					.bind("mouseleave",function(){
						_this.trigger("itemMouseLeave",[items[this.index]]);	
					})
					.bind("click",function(){
						_this.trigger("itemClick",[items[this.index]]);	
					})
				items.push(item);	
				_this.add(item);	
			}
			
			return _this;
		}
		
		////////////////////////返回///////////////////////
		init();
		return _this;
	}
})(jQuery);