(function($){
	/*
		tcframe accordion
			1、继承自canvas
			2、事件
				activeChanged
			3、数据源
				{
					buttonHeight:25,
					activeContainer:"c3",
					dataprovider:[
						{id:"c1",label:"canvas1"},
						{id:"c2",label:"canvas2"},
						{id:"c3",label:"canvas3"},
						{id:"c4",label:"canvas4"},
						{id:"c5",label:"canvas5"}	
					]
				}
			4、接口
				.appendContainerAtIndex(item,integer)
				.removeContainerById(id)
				.getContainerById(id)
				.activeContainer(id)
				.dataprovider(array)	
	*/
	$.fn.tAccordion = function(param){
		
		var _containers=[];
		var _buttons=[];
		var _activeContainer="";
		var _this=this.tCanvas(param);
			 param=param||{};
		
		if(param.buttonHeight==null){param.buttonHeight=25;}
		if(param.dataprovider==null || !param.dataprovider.length){
			param.dataprovider=[
				{id:"c1",label:"canvas1"},
				{id:"c2",label:"canvas2"},
				{id:"c3",label:"canvas3"}
			];	
		}
		
		function init(){		
			_this.addClass("tc-accordion");
			_this.dataprovider(param.dataprovider);
			if(param.activeContainer!=null){_activeContainer=param.activeContainer;}
		}
		 	
		function change(id){
			_activeContainer=id;
			_this.refresh();
		}
			
		function show(containerHeight){
			var container=null;
			var p=0;
			for(var n=0;n<_containers.length;n++){
				if(_containers[n].id==_activeContainer){
					container=_containers[n];
					p=n;	
				}
				_containers[n].css("display","none");
			}
			if(!container){return;}
			container.setPosition({
				left:5,right:2,y:(p+1)*(param.buttonHeight)+10,height:containerHeight-5
			});
			container.fadeIn("fast",null,function(){
				_this.trigger("activeChanged", [_activeContainer]);
				container.refresh();
			});
		}
		
		
		
		////////////////////////接口///////////////////////
		
		//在指定位置添加子容器
		_this.appendContainerAtIndex=function(item,index){
			if(!item||!item.id||!item.label){return _this;}
			var btn=$("<div>").tButton({
				label:item.label,
				position:{left:2,right:4,height:param.buttonHeight}
			});
			var container=$("<div>").tCanvas({scrollbar:{}}).addClass("tc-accordion-canvas");	
			container.id=btn[0].id=btn.id=item.id;
			btn.bind("click",function(){change(this.id);});
			_this.add(container);
			_this.add(btn);
			
			if(index==null||index>_containers.length-1){
				_containers.push(container);	
				_buttons.push(btn);	
			}else if(index<1){
				_containers.unshift(container);	
				_buttons.unshift(btn);	
			}else{
				var newContainer=[];
				var newButton=[];
				for(var n=0;n<_buttons.length;n++){
					if(n!=index){
						newContainer.push(_containers[n]);
						newButton.push(_buttons[n]);	
					}else{
						newContainer.push(container);
						newContainer.push(_containers[n]);
						newButton.push(btn);
						newButton.push(_buttons[n]);	
					}
				}
				_containers=newContainer;
				_buttons=newButton;
			}
			_activeContainer=item.id;
			_this.render();
			return _this;	
		}
		
		//删除子容器
		_this.removeContainerById=function(id){
			if(_containers.length==0){return _this;}
			var newContainer=[];
			var newBtn=[];
			for(var n=0;n<_containers.length;n++){
				if(_containers[n].id==id){
					_this.del(_containers[n]);
					_this.del(_buttons[n]);	
				}else{
					newContainer.push(_containers[n]);
					newBtn.push(_buttons[n]);	
				}
			}
			_containers=newContainer;
			_buttons=newBtn;
			_this.render();
			return _this;
		}
		
		//获取子容器
		_this.getContainerById=function(id){
			if(_containers.length==0){return null;}
			for(var n=0;n<_containers.length;n++){
				if(_containers[n].id==id){
					return _containers[n];	
				}
			}
			return null;
		}
		
		//设置当前激活窗口
		_this.activeContainer=function(id){
			if(_buttons.length==0){return _this;}
			for(var n=0;n<_buttons.length;n++){
				if(_buttons[n].id==id){change(id);break;}
			}
			return _this;
		}
		
		//更新数据源
		_this.dataprovider=function(items){
			if(items==null||!items.length){return _this;}
			param.dataprovider=items;
			while(_buttons.length>0){
				_this.del(_buttons[0]);
				_this.del(_containers[0]);
				_buttons.shift();	
				_containers.shift();
			}
			for(var n=0;n<param.dataprovider.length;n++){
				if(param.dataprovider[n].id==null||param.dataprovider[n].label==null){continue;}
				var btn=$("<div>").tButton({
					label:param.dataprovider[n].label,
					position:{left:2,right:4,height:param.buttonHeight}
				});
				var container=$("<div>").tCanvas({scrollbar:{}}).addClass("tc-accordion-canvas");	
				container.id=btn[0].id=btn.id=param.dataprovider[n].id;
				btn.bind("click",function(){change(this.id);});
				_containers.push(container);	
				_buttons.push(btn);
				_this.add(container);
				_this.add(btn);
			}
			if(_buttons.length>0){_activeContainer=_buttons[0].id;}
			_this.render();
			return _this;	
		}
				
		//刷新
		_this.refresh=function(){
			if(!_this.$display){return _this;}
			var height=_this.height();
			var containerHeight=height-_buttons.length*(param.buttonHeight+2)-4;
			var usedY=3;
			var moved=_buttons.length;
			for(var n=0;n<_containers.length;n++){_containers[n].hide();}
			for(var n=0;n<_buttons.length;n++){
				_buttons[n].render();
				_buttons[n].setPosition({y:usedY},"fast",function(){
					moved--;
					if(moved==0){show(containerHeight);}
				});
				if(_buttons[n].id==_activeContainer){
					usedY+=param.buttonHeight+containerHeight+2;	
				}else{
					usedY+=param.buttonHeight+2;		
				}
			}
			return _this;
		}
		
		////////////////////////返回///////////////////////
		init();
		return _this;
	}
})(jQuery);