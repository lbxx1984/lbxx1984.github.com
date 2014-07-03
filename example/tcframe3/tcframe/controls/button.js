(function($){
	/*
		tcframe button
			1、继承自uicomponent
			2、数据源
				｛
					label:"确定",
					ico:{src:"assets/ico/1.png",width:15,height:15,left:5,top:5},
					image:{
						src:"assets/ico/icons.png",
						normal:{left:0,top:0},
						hover:{left:-20,top:0},
						active:{left:-40,top:0},
						selected:{left:-60,top:0},
						disable:{left:-80,top:0}
					},
					selected:false
				｝
			3、接口
				.selected(boolean)
				.disable(boolean)		
	*/
	$.fn.tButton = function(param){

		var _this=this.uicomponent(param);
			_this.$selected=false;
			_this.$isImageButton=false;
			_this.$disable=false;
			_this.$ico=null;
			param=param||{};
		
		if(param.label==null){param.label="button";}
		if(param.position==null){param.position={width:100,height:25};}
		if(param.ico!=null && param.ico.src==null){param.ico=null;}
		if(param.image!=null){
			if(param.image.src==null){
				param.image=null;
			}else{
				param.image.normal=param.image.normal||{left:0,top:0};
				param.image.hover=param.image.hover||{left:0,top:0};
				param.image.active=param.image.active||{left:0,top:0};
				param.image.selected=param.image.selected||{left:0,top:0};
				param.image.disable=param.image.disable||{left:0,top:0};
			}
		}
		
		function init(){
			if(param.image){
				_this.$isImageButton=true;
				_this.css("overflow","hidden");
				_this.$ico=$("<img>",{src:param.image.src}).css("position","absolute").css(param.image.normal).appendTo(_this);
				_this.bind("mouseenter",function(){
					if(_this.$disable){return;}
					_this.$ico.css(param.image.hover);
				});
				_this.bind("mousedown",function(){
					if(_this.$disable){return;}
					_this.$ico.css(param.image.active);
				});
				_this.bind("mouseup",function(){
					if(_this.$disable){return;}
					_this.$ico.css(param.image.hover);
				});
				_this.bind("mouseleave",function(){
					if(_this.$disable){return;}
					if(_this.$selected){				
						_this.$ico.css(param.image.selected);
					}else{
						_this.$ico.css(param.image.normal);
					}
				});
			}else{
				_this.addClass("tc-button");
				_this.html(param.label);
				_this.css("line-height",param.position.height+"px");
				if(param.ico!=null){
					_this.$ico=$("<img>",{src:param.ico.src}).css("position","absolute").css(param.ico).appendTo(_this);	
				}
			}
			if(param.selected!=null){_this.$selected=param.selected;}
			if(param.disable!=null){_this.$disable=param.disable;}
			_this.selected(_this.$selected);
			_this.disable(_this.$disable);
		}
		 	
			
		////////////////////////接口///////////////////////
		
		//设置选定状态
		_this.selected=function(b){
			if(_this.$disable){return _this;}
			_this.$selected=b;
			if(b){
				if(_this.$isImageButton){
					_this.$ico.css(param.image.selected);
				}else{
					_this.removeClass();
					_this.addClass("tc-button-selected");
				}	
			}else{
				if(_this.$isImageButton){
					_this.$ico.css(param.image.normal);
				}else{
					_this.removeClass();
					_this.addClass("tc-button");	
				}	
			}
			return _this;
		}
		
		//设置激活状态
		_this.disable=function(b){
			_this.$disable=b;
			if(b){
				if(_this.$isImageButton){
					_this.$ico.css(param.image.disable);
				}else{
					_this.removeClass();
					_this.addClass("tc-button-disable");
				}
			}else{
				if(_this.$isImageButton){
					if(_this.$selected){
						_this.$ico.css(param.image.selected);
					}else{
						_this.$ico.css(param.image.normal);
					}
				}else{
					_this.removeClass();
					if(_this.$selected){
						_this.addClass("tc-button-selected");
					}else{
						_this.addClass("tc-button");
					}
				}
			}
			return _this;
		}
		
		////////////////////////返回///////////////////////
		init();
		return _this;
	}
})(jQuery);