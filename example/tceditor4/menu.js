(function($){

	$.fn.menu = function(param){
		
		var _this=this;		
		var _language=0;
		var _lock=true;
		var _current=-1;
		var _currentTranslateType=0;
		var _currentView=-1;
		var _item=[];
		var _boxes=[];
		var _createGeoButtons=[];
		var _translateButtons=[];
		var _viewButtons=[];
		var _lockButtons=[];
		
		if(param.language=="en"){_language=1;}
		
		
		
		//初始化
		_this
			.addClass("menu")
			.bind("mouseleave",function(e){
				if(!_lock){_current=-1;hiddeMenuList();}
			})
			.css({left:param.left+"px",top:param.top+"px",width:param.width+"px",height:param.height+"px"})
		if(param.data){
			for(var n=0;n<param.data.length;n++){
				var boxes=$("<div>")
					.addClass("menulist")
					.css({left:"0px",top:(-60-param.height)+"px",height:"60px",width:param.width+"px"})
					.appendTo(_this);
				var item=$("<div>")
					.addClass("menuitem")
					.css({left:(n*100)+"px",top:"0px",height:param.height+"px",width:"100px","line-height":param.height+"px"})
					.html(param.data[n].label[_language])
					.bind("mouseenter",function(e){
						if(this.index==_current){
							_item[this.index].css({"background-color":"rgba(0,0,0,0.6)"});
						}else{
							_item[this.index].css({"background-color":"rgba(0,0,0,0.3)"});
						}
					})
					.bind("mouseleave",function(e){
						if(this.index==_current){
							_item[this.index].css({"background-color":"rgba(0,0,0,0.2)"});	
						}else{
							_item[this.index].css({"background-color":"rgba(0,0,0,0)"});	
						}
					})
					.bind("click",function(e){
						if(_current==this.index){return;}
						if(_current>-1){_item[_current].css({"background-color":"rgba(0,0,0,0)"});	}
						hiddeMenuList();
						_current=this.index;
						_item[_current].css({"background-color":"rgba(0,0,0,6)"});
						_boxes[_current].animate(
							{top:param.height+"px"},"fast",null,function(e){hiddeMenuList(_current);}
						);	
					});
				var lock=$("<div>")
					.css({position:"absolute",bottom:"0px",right:"0px",width:"30px",height:"20px"})
					.html('<img src="images/button/09.png" style="width:10px;height:8px;position:absolute;left:10px;top:5px;"/>')
					.bind("mouseenter",function(e){
						$(this).css({"background-color":"rgba(55,119,209,0.9)"});
					})
					.bind("mouseleave",function(e){
						$(this).css({"background-color":""});
					})
					.bind("click",function(e){
						_lock=!_lock;
						var url="08.png";
						if(_lock){url="09.png";}
						for(var n=0;n<_lockButtons.length;n++){
							_lockButtons[n].html('<img src="images/button/'+url+'" style="width:10px;height:8px;position:absolute;left:10px;top:5px;"/>');	
						}
					})
					.appendTo(boxes);					
				item[0].index=n;
				_item.push(item);
				_boxes.push(boxes);
				_lockButtons.push(lock);
				item.appendTo(_this);
			}
		}
		
		if(param.geometry){
			for(var n=0;n<param.geometry.length;n++){
				var item=$("<div>")
					.addClass("menuGeometryButton")	
					.css({top:"5px",width:"50px",height:"50px",left:(5+50*n)+"px"})
					.html('<img src="images/button/'+param.geometry[n].ico+'" style="width:50px;height:50px;"/>')
					.bind("click",function(e){
						_createGeoButtons[this.index].addClass("menuGeometryButtonChecked");
						param.geometry[this.index].checked=true;
						_this.trigger("ButtonClick",[param.geometry[this.index]]);	
					})
					.appendTo(_boxes[0]);
				item[0].index=n;
				_createGeoButtons.push(item);
			}			
		}
		
		if(param.view){
			for(var n=0;n<param.view.length;n++){
				var item=$("<div>")
					.addClass("menuGeometryButton")	
					.css({top:"3px",width:"50px",height:"50px",left:(3+51*n)+"px"})
					.css({border:"1px solid #CCCCCC","text-align":"center"})
					.html(param.view[n].command)
					.bind("click",function(e){
						_viewButtons[_currentView].removeClass("menuGeometryButtonChecked");
						_currentView=this.index;
						_viewButtons[_currentView].addClass("menuGeometryButtonChecked");
						_this.trigger("ViewButtonClick",[param.view[this.index].command]);
					})
					.appendTo(_boxes[3]);
				item[0].index=n;
				if(param.view[n].checked){
					_currentView=n;
					item.addClass("menuGeometryButtonChecked");
				}
				_viewButtons.push(item);
			}
		}
		
		if(param.translate){
			for(var n=0;n<param.translate.length;n++){
				var item=$("<div>")
					.addClass("menuGeometryButton")	
					.css({top:"5px",width:"50px",height:"50px",left:(5+50*n)+"px"})
					.html('<img src="images/button/'+param.translate[n].ico+'" style="width:50px;height:50px;"/>')
					.bind("click",function(e){
						if(param.translate[this.index].type=="checked"){
							if(_currentTranslateType==this.index){return;}
							_translateButtons[_currentTranslateType].removeClass("menuGeometryButtonChecked");
							_currentTranslateType=this.index;
							_translateButtons[_currentTranslateType].addClass("menuGeometryButtonChecked");
							//_this.trigger("ButtonClick",[param.geometry[this.index]]);	
						}else if(param.translate[this.index].type=="click"){
							
						}else if(param.translate[this.index].type=="ratio"){
							if(param.translate[this.index].checked){
								param.translate[this.index].checked=false;
								_translateButtons[this.index].html('<img src="images/button/'+param.translate[this.index].ico+'" style="width:50px;height:50px;"/>')
							}else{
								param.translate[this.index].checked=true;
								_translateButtons[this.index].html('<img src="images/button/'+param.translate[this.index].checkedICO+'" style="width:50px;height:50px;"/>')
							}
						}
						_this.trigger("TranslateCtrlButtonClick",[param.translate[this.index]]);
					})
					.appendTo(_boxes[4]);
				item[0].index=n;
				if(param.translate[n].checked){
					item.addClass("menuGeometryButtonChecked");
				}
				_translateButtons.push(item);
			}
		}
		
		if(_lock){
			_current=0;
			_boxes[_current].css({top:param.height+"px"});
			_item[_current].css({"background-color":"rgba(0,0,0,0.2)"});		
		}
		
		
		
		
		//内部函数
		function hiddeMenuList(index){
			for(var n=0;n<_boxes.length;n++){
				if(index==n){continue;}
				_boxes[n].css({top:(-100-param.height)+"px"});	
				if(n==_current){
					_item[n].css({"background-color":"rgba(0,0,0,0.2)"});		
				}else{
					_item[n].css({"background-color":"rgba(0,0,0,0)"});	
				}
			}
			
		}
		
		
		
		//对外接口
		_this.change=function(index){
			for(var n=0;n<param.data.length;n++){
				if(n==index){
					_item[n].css({"background-color":"rgba(0,0,0,0.2)"});
					_boxes[n].css({top:param.height+"px"});	
				}else{
					_item[n].css({"background-color":"rgba(0,0,0,0)"});
					_boxes[n].css({top:(-60-param.height)+"px"});
				}
			}
			_current=index;
		}
		
		_this.show=function(id){
			var index=-1;
			for(var n=0;n<param.data.length;n++){if(param.data[n].id==id){index=n;break;}}
			if(index<0){return;}
			_this.change(index);
		}
		
		_this.reset=function(obj){
			for(var n=0;n<_createGeoButtons.length;n++){
				if(param.geometry[n].type=="checked"){
					if(obj.action == param.geometry[n].action){
						if(!param.geometry[n].checked){
							param.geometry[n].checked=true;	
							_createGeoButtons[n].addClass("menuGeometryButtonChecked");	
						}
						if(obj.type!=param.geometry[n].command){
							param.geometry[n].checked=true;	
							_createGeoButtons[n].removeClass("menuGeometryButtonChecked");	
						}
					}else{
						if(param.geometry[n].checked){
							param.geometry[n].checked=true;	
							_createGeoButtons[n].removeClass("menuGeometryButtonChecked");	
						}
						
					}
				}
			}
		}
		
		_this.setPosition=function(p){
			param.width=p.width;
			param.height=p.height;
			param.left=p.left;
			param.top=p.top;
			_this.css({left:param.left+"px",top:param.top+"px",width:param.width+"px",height:param.height+"px"});
			for(var n=0;n<_boxes.length;n++){
				_boxes[n].css({width:param.width+"px"})	
			}
		}
		
		return _this;
	}
})(jQuery);