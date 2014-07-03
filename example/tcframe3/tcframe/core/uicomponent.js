(function($){
	/*
		tcframe uicomponent
			1、根据父容器设定定位方式;
			2、可以使用left\top\right\bottom定位，也可以使用x\y\width\height定位
			3、初始化时不渲染，被添加后再渲染
			4、不提供滚动条接口
			5、数据源
				{
					position:{left:50,right:50,top:50,bottom:50},
					draggable:{},//jQuery-ui.draggable	
					display:{type:"fade",speed:"fast"}
				}
			6、接口
				.enableDrag(boolean)
				.display(boolean)
				.setPosition(position,animationSpeed,callbackFunc)
				.getPosition()
				.render(animationSpeed,callbackFunc)
				.refresh()
	
	*/
	$.fn.uicomponent = function(param){
		
		var _this=this;
			_this.$display=false;
			_this.$draggable=false;
			param=param||{};
		
		
		function init(){
			_this.addClass("tc-uicomponent");
			if(_this[0].parentNode==null){
				//新创建的DOM
				_this.css("position","absolute");
			}else{
				//页面中原本存在的DOM
				_this.css("position","relative");
			}
			_this.enableDrag(param.draggable);
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
		
		//显示开关（以指定的特效显示|隐藏容器）
		_this.display=function(b){
			_this.$display=b;
			if(param.display && param.display.type){
				switch (param.display.type){
					case "show":
						if(b){
							_this.show(param.display.speed,null,function(){_this.refresh();});
						}else{
							_this.hide(param.display.speed);
						}
						break;	
					case "slide":
						if(b){
							_this.slideDown(param.display.speed,null,function(){_this.refresh();});
						}else{
							_this.slideUp(param.display.speed);
						}
						break;
					case "fade":
						if(b){
							_this.fadeIn(param.display.speed,null,function(){_this.refresh();});
						}else{
							_this.fadeOut(param.display.speed);
						}
						break;
					default:
						if(b){
							_this.show();_this.refresh();
						}else{
							_this.hide();
						}
						break;
				}			
			}else{
				if(b){
					
					_this.show();_this.refresh();
				}else{
					_this.hide();
				}		
			}
			return _this;
		}
		
		//设置位置（修改容器位置信息并重新渲染）
		_this.setPosition=function(position,anm,callback){
			if(!position){return _this;}
			param.position=position;
			_this.render(anm,callback);			
			return _this;
		}
		
		//获取位置信息
		_this.getPosition=function(){
			return param.position;	
		}
		
		//渲染（用于父级容器调用或setPosition方法调用，render和display的区别是：display偏重效果，render偏重结果）
		_this.render=function(anm,callback){
			if(!_this.$parent){
				_this.$parent=$(_this[0].parentNode);
			}
			if(!param.position){
				_this.refresh();
				return _this;
			}
			var pos=calcPosition(_this.$parent,param.position);
			
			if(anm==null){
				if(pos[0]>-1){_this.css("left",pos[0]+"px");}
				if(pos[1]>-1){_this.css("top",pos[1]+"px");}
				if(pos[2]>-1){_this.css("width",pos[2]+"px");}
				if(pos[3]>-1){_this.css("height",pos[3]+"px");}
				_this.refresh();
			}else{
				var obj={};
				if(pos[0]>-1){obj.left=pos[0]+"px";}
				if(pos[1]>-1){obj.top=pos[1]+"px";}
				if(pos[2]>-1){obj.width=pos[2]+"px";}
				if(pos[3]>-1){obj.height=pos[3]+"px";}
				_this.animate(obj,anm,null,function(){
					if(typeof(callback)=="function"){callback();}
					_this.refresh();
				});	
			}			
			return _this;	
		}	
		
		//刷新（容器的尺寸发生变化或显示完成后执行）
		_this.refresh=function(){
			if(!_this.$display){return _this;}
			return _this;
		}
		
		
		

		////////////////////////私有///////////////////////

		//根据定位信息确定实际位置（根据left、top、right、bottom|x、y、width、height这两种组合，设置容易的位置和大小。第一组优先级高）
		function calcPosition(_parent,_position){
			
			if(!_parent||!_position){return [-1,-1,-1,-1];}
			var left=-1,top=-1,width=-1,height=-1;
			
			if(_position.left!=null&&_position.right!=null){
				
				left=_position.left;
				width=_parent.width()-left-_position.right;
				
			}else if(_position.left==null&&_position.right==null){
				
				if(_position.x!=null){
					left=_position.x;
				}
				if(_position.width!=null){
					width=_position.width;
				}
				
			}else if(_position.left==null&&_position.right!=null){
				
				if(_position.width!=null){
					width=_position.width;
					left=_parent.width()-width-_position.right;
				}
				
			}else if(_position.left!=null&&_position.right==null){
			
				left=_position.left;
				if(_position.width!=null){
					width=_position.width;	
				}
				
			}
	
			if(_position.top!=null&&_position.bottom!=null){
				
				top=_position.top;
				height=_parent.height()-top-_position.bottom;
				
			}else if(_position.top==null&&_position.bottom==null){
				
				if(_position.y!=null){
					top=_position.y;
				}
				if(_position.height!=null){
					height=_position.height;
				}
				
			}else if(_position.top==null&&_position.bottom!=null){
				
				if(_position.height!=null){
					height=_position.height;
					top=_parent.height()-height-_position.bottom;
				}
				
			}else if(_position.top!=null&&_position.bottom==null){
			
				top=_position.top;
				if(_position.height!=null){
					height=_position.height;	
				}
				
			}	
					
			return [left,top,width,height];
		}
		
		
		
		
		////////////////////////主返回///////////////////////
		init();
		return _this;
	}
})(jQuery);