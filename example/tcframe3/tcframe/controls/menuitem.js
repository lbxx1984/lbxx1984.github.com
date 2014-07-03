(function($){
	/*
		tcframe menuitem
			1、继承自canvas
			2、事件
			3、数据源
				{
					position:{x:50,y:50,width:200,height:30},
					label:"文件",
					hotkey:"Ctrl+F",//hotkey只有在没有子菜单时才会显示
					children:[]
				}
			4、接口
				.disable(boolean)
				.
					
	*/
	$.fn.tMenuItem = function(param){
		
		param=param||{};
		if(param.position==null){
			param.position={width:200,height:30}	
		}
		if(param.position.width==null){param.position.width=200;}
		if(param.position.height==null){param.position.height=30;}
		if(param.label==null){param.label="menuitem";}
		if(param.selected==null){param.selected=""}else{param.selected="•"}
		if(param.hotkey==null){param.hotkey="";}
		if(param.children!=null&&param.children.length){param.childlabel="▶";param.hotkey="";}else{param.childlabel="";}

		var _this=this.tCanvas(param);
		_this.$selected=false;
		_this.$disable=false;
		
		
		function init(){
			
			_this.addClass("tc-menuitem-container");
			_this.id=_this[0].id=param.id;
			_this.selectedLabel=$("<div>")
				 .tCanvas({position:{width:16,height:param.position.height}})
				 .addClass("tc-menuitem-label")
				 .html(param.selected)
				 .css("line-height",param.position.height+"px")
				 .css("text-align","center");
			_this.label=$("<div>")
				 .tCanvas({position:{x:16,width:param.position.width-32}})	
				 .addClass("tc-menuitem-label")
				 .html(param.label)
				 .css("line-height",param.position.height+"px");
			_this.hotkey=$("<div>")
				 .tCanvas({position:{x:16,width:param.position.width-32}})
				 .addClass("tc-menuitem-label")
				 .html(param.hotkey)
				 .css("line-height",param.position.height+"px")
				 .css("text-align","right")
				 .css("font-family","Times new roman");
			_this.child=$("<div>")
				 .tCanvas({position:{right:1,width:16}})	
				 .addClass("tc-menuitem-label")
				 .html(param.childlabel)
				 .css("line-height",param.position.height+"px")
				 .css("text-align","center");	  
			_this.add(_this.selectedLabel);
			_this.add(_this.label);	
			_this.add(_this.hotkey);
			_this.add(_this.child);	
			
			
			if(param.disable){_this.disable(true);}
			if(param.selected=="•"){_this.$selected=true;}	
		}
		
		////////////////////////接口///////////////////////
		
		_this.disable=function(b){
			
			if(_this.$disable==b){return _this;}
			_this.$disable=b;
			if(b){
				_this.selectedLabel.removeClass();
				_this.selectedLabel.addClass("tc-menuitem-label-disable");
				_this.label.removeClass();
				_this.label.addClass("tc-menuitem-label-disable");
				_this.hotkey.removeClass();
				_this.hotkey.addClass("tc-menuitem-label-disable");	
				_this.child.removeClass();
				_this.child.addClass("tc-menuitem-label-disable");	
			}else{
				_this.selectedLabel.removeClass();
				_this.selectedLabel.addClass("tc-menuitem-label");
				_this.label.removeClass();
				_this.label.addClass("tc-menuitem-label");
				_this.hotkey.removeClass();
				_this.hotkey.addClass("tc-menuitem-label");	
				_this.child.removeClass();
				_this.child.addClass("tc-menuitem-label");
			}
			return _this;
		}
		
		_this.selected=function(b){
			
			if(_this.$selected==b){return _this;}
			_this.$selected=b;
			if(b){
				param.selected="•";
			}else{
				param.selected="";
			}
			this.selectedLabel.html(param.selected);
			
			return _this;
		}
		
		////////////////////////返回///////////////////////
		init();
		
		
		return _this;
	}
})(jQuery);