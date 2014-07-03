(function($){
	/*
		tcframe menu
			1、继承自canvas
			2、事件
				itemMouseEnter
				itemMouseLeave
				itemClick
			3、数据源
		{
			position:{height:35},
			itemHeight:30,
			itemWidth:200,
			labelWidth:100,
			children:[
				{
					id:"1",label:"文件",hotkey:"Ctrl+F",
					children:[
						{
							id:"1-1",label:"新建",hotkey:"Ctrl+N",
							children:[]
						},{
							id:"1-2",label:"打开",hotkey:"Ctrl+N",
							children:[]
						},{
							id:"1-3",label:"打开最近文件",
							children:[
								{"id":"1-3-1",label:"文件1"},
								{"id":"1-3-2",label:"文件2",disable:true,
									children:[
										{"id":"1-3-2-1",label:"版本1"},
										{"id":"1-3-2-2",label:"版本2"},
										{"id":"1-3-2-3",label:"版本3"}
									]
								},
								{"id":"1-3-3",label:"文件3"},
								{"id":"1-3-4",label:"文件4"},
								{"id":"1-3-5",label:"文件5"}
							]
						},{
							id:"1-4",label:"关闭",hotkey:"Ctrl+W",
							children:[]
						},{
							id:"1-5",label:"全部关闭",
							children:[]
						},{
							id:"1-6",label:"保存",hotkey:"Ctrl+S",selected:true,
							children:[]
						},{
							id:"1-7",label:"另存为",hotkey:"Ctrl+Shift+S",
							children:[
								{"id":"1-7-1",label:".jpg"},
								{"id":"1-7-2",label:".gif"},
								{"id":"1-7-3",label:".png"},
								{"id":"1-7-4",label:".svg"},
								{"id":"1-7-5",label:".psd"}
							]
						},{
							id:"1-8",label:"退出",hotkey:"Alt+F4",
							children:[]
						}
					]
				},{
					id:"2",label:"编辑",
					children:[
						{
							id:"2-1",label:"撤销",
							children:[]
						},{
							id:"2-2",label:"重做",
							children:[]
						},{
							id:"2-4",label:"拷贝",
							children:[]
						},{
							id:"2-5",label:"粘贴",
							children:[]
						},{
							id:"2-6",label:"查找",
							children:[]
						},{
							id:"2-7",label:"替换",
							children:[]
						},{
							id:"2-8",label:"首选参数",
							children:[]
						}
					]
				},{
					id:"3",label:"查看",
					children:[
						{
							id:"3-1",label:"放大",
							children:[]
						},{
							id:"3-2",label:"缩小",
							children:[]
						},{
							id:"3-3",label:"缩放比例",
							children:[]
						},{
							id:"3-7",label:"代码设计",
							children:[]
						},{
							id:"3-8",label:"切换试图",
							children:[]
						}
					]
				},{
					id:"4",label:"插入",
					children:[
						{
							id:"4-1",label:"标签",
							children:[]
						},{
							id:"4-2",label:"图像",
							children:[]
						},{
							id:"4-3",label:"媒体",
							children:[]
						},{
							id:"4-4",label:"表格",
							children:[]
						},{
							id:"4-5",label:"表单",
							children:[]
						},{
							id:"4-6",label:"日期",
							children:[]
						},{
							id:"4-8",label:"数据对象",
							children:[]
						}
					]
				}
			]
		}
			4、接口
				.dataprovider(arr)
				.getItemById(id)
				.selectItem(id,boolean)
				.disableItem(id,boolean)
	*/
	
	
	$.fn.tMenu = function(param){

		param=param||{};
		if(!param.position){param.position={height:35};}
		if(param.position.height==null){param.position.height=35;}
		if(param.itemHeight==null){param.itemHeight=30;}
		if(param.itemWidth==null){param.itemWidth=200;}
		if(param.labelWidth==null){param.labelWidth=100;}

		var _this=this.tCanvas(param);	
		var _menulists=[];
		var _buttonlists=[];
		
		
		function init(){
			
			_this.addClass("tc-menu");
			_this.dataprovider(param.children);
			_this.bind("mouseleave",function(){
				for(var n=0;n<_menulists.length;n++){
					if(_menulists[n].added){
						_menulists[n].added=false;
						_this.del(_menulists[n]);
					}
				}
			});
			
		}
		 	
		
		function produceMenuList(arr,parentId,level){
			
			if(!arr||!arr.length||!parentId){return;}
			var type=level>0?"slide":"fade";
			var list=$("<div>")
				.tMenuList({
					display:{type:type,speed:"fast"},
					itemHeight:param.itemHeight,
					children:arr
				})
				.bind("itemMouseEnter",function(e,item){
					if(item.$disable){return;}
					showMenuList(item.id,item);
					_this.trigger("itemMouseEnter",[item]);
				})
				.bind("itemMouseLeave",function(e,item){
					if(item.$disable){return;}
					_this.trigger("itemMouseLeave",[item]);	
				})
				.bind("itemClick",function(e,item){
					if(item.$disable){return;}
					_this.trigger("itemClick",[item]);	
				})
				
			list.id=parentId;
			list.level=level;
			list.added=false;
			_menulists.push(list);
			
			for(var n=0;n<arr.length;n++){
				if(arr[n].children && arr[n].children.length){
					produceMenuList(arr[n].children,arr[n].id,level+1);	
				}
			}
			
		}
		
		function showMenuList(id,t){
			
			var list=null;
			
			//查找
			for(var n=0;n<_menulists.length;n++){
				if(_menulists[n].id==id ){list=_menulists[n];break;}	
			}
			if(!list){return;}
			
			//位置
			var left=t.offset().left-_this.offset().left;
			var top	=t.offset().top-_this.offset().top;
			var width	=t.width();
			var height	=t.height();
			if(list.level==0){
				top=top+height;
			}else{
				left=left+width+1;	
			}
			
			//显示该菜单
			if(!list.added){
				list.added=true;
				list.setPosition({
					x:left,y:top,width:param.itemWidth,height:list.getPosition().height
				});
				_this.add(list);	
			}
			
			//隐藏所有大于等于该菜单层次的菜单			
			for(n=0;n<_menulists.length;n++){
				if( _menulists[n].id!=id && _menulists[n].level >=list.level &&_menulists[n].added){
					_menulists[n].added=false;
					_this.del(_menulists[n]);
				}
			}
		}
		
		
		
		////////////////////////接口///////////////////////
		
		_this.selectItem=function(id,b){
			var item=null;
			item=_this.getItemById(id);
			if(!item){return _this;}	
			item.selected(b);
			return _this;
		}
		
		_this.disableItem=function(id,b){
			var item=null;
			item=_this.getItemById(id);
			if(!item){return _this;}	
			item.disable(b);
			return _this;
		}
		
		_this.getItemById=function(id){
			
			if(_buttonlists.length==0){return null;}
			for(var n=0;n<_buttonlists.length;n++){
				if(_buttonlists[n].id==id){return _buttonlists[n];}	
			}
			
			if(_menulists.length==0){return null;}
			for(var n=0;n<_menulists.length;n++){
				var item=null;
				item=_menulists[n].getItemById(id);
				if(item){return item;}
			}
			
			return null;
		}
		
		_this.dataprovider=function(arr){
			
			if(!arr||!arr.length){return _this;}
			_this.removeAll();
			_menulists=[];
			_buttonlists=[];
			
			for(var n=0;n<arr.length;n++){
				
				var btn=$("<div>")
				.tButton({
					position:{
						x:n*param.labelWidth,
						y:0,
						width:param.labelWidth,
						height:param.position.height-2
					},
					label:arr[n].label
				})
				.bind("mouseenter",function(){
					_this.css("z-index",999);
					if(this.tParent.$disable){return;}
					showMenuList(this.id,this.tParent);
					_this.trigger("itemMouseEnter",[this.tParent]);			
				})
				.bind("mouseleave",function(){
					if(this.tParent.$disable){return;}
					_this.trigger("itemMouseLeave",[this.tParent]);	
				})
				.bind("click",function(){
					if(this.tParent.$disable){return;}
					_this.trigger("itemClick",[this.tParent]);	
				})
				
				btn[0].tParent=btn;
				btn.id=btn[0].id=arr[n].id||new Date().getTime();
				
				if(arr[n].disable){btn.disable(true);}	
				if(arr[n].selected){btn.selected(true);}
				
				if(arr[n].children && arr[n].children.length){
					produceMenuList(arr[n].children,btn.id,0);
				}
				
				_this.add(btn);
				_buttonlists.push(btn);
			}
			return _this;
		}

		////////////////////////返回///////////////////////
		init();
		return _this;
	}
})(jQuery);