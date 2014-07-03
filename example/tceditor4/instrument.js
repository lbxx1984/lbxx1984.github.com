(function($){

	$.fn.instrument = function(param){
		
		var _this=this;		
		var _mouse3d=$("<div>");
		var _alert=$("<div>");
		var _buttons=[];
		
		_this
			.addClass("instrument")
			.css({left:param.left+"px",top:param.top+"px",width:param.width+"px",height:param.height+"px"});
		_alert
			.addClass("instrument_alert")
			.css({left:"0px",top:"0px",width:param.width+"px",height:param.height+"px"})
			.appendTo(_this);
		_mouse3d
			.css({position:"absolute",top:"0px",width:param.width+"px",height:param.height+"px",left:"0px","text-align":"center","padding-left":"50px"})
			.appendTo(_this);
		
		
		if(param.buttons && param.buttons.length){
			var usedLeft=(param.width*0.5)+130;
			var usedRight=(param.width*0.5)-130+param.height;
			for(var n=0;n<param.buttons.length;n++){
				var left=0;if(param.buttons[n].left){left=usedRight;}else{left=usedLeft;}
				var btn=$("<div>")
					.addClass("simpleButton")
					.css({left:left+"px",height:param.height+"px",width:param.height+"px"})
					.html('<img src="images/button/'+param.buttons[n].ico+'" style="position:absolute;left:'+(param.height-30)*0.5+'px;top:'+(param.height-30)*0.5+'px;width:30px;height:30px;"/>')
					.bind("click",function(e){ButtonClick(this.index);})
					.appendTo(_this);
				btn[0].index=n;
				_buttons.push(btn);	
				if(param.buttons[n].left){
					usedRight-=param.height;
				}else{
					usedLeft+=param.height;
				}
			}
		}
		
		
		
		
		function ButtonClick(i){
			var o=param.buttons[i];			
			if(o.type=="click"){
				//TODO
			}
			if(o.type=="ratio"){
				if(o.checked){
					o.checked=false;
					_buttons[i].html('<img src="images/button/'+o.ico+'" style="position:absolute;left:'+(param.height-30)*0.5+'px;top:'+(param.height-30)*0.5+'px;width:30px;height:30px;"/>');	
				}else{
					o.checked=true;	
					_buttons[i].html('<img src="images/button/'+o.checkedICO+'" style="position:absolute;left:'+(param.height-30)*0.5+'px;top:'+(param.height-30)*0.5+'px;width:30px;height:30px;"/>');
				}	
			}
			if(o.type=="checked"){
				if(o.checked){
					o.checked=false;
					_buttons[i].removeClass("simpleButtonChecked");		
				}else{
					o.checked=true;	
					_buttons[i].addClass("simpleButtonChecked");
				}
			}
			_this.trigger("ButtonClick",[o]);
		}
		


		//对外接口
		_this.update=function(p){
			if(p.mouse3d){
				_mouse3d.html("x:"+parseInt(p.mouse3d.x)+" y:"+parseInt(p.mouse3d.y)+" z:"+parseInt(p.mouse3d.z));
			}
		}
		_this.reset=function(obj){
			for(var n=0;n<_buttons.length;n++){
				if(param.buttons[n].type!="checked"){continue;}
				if(param.buttons[n].checked){
					if(obj.type!=param.buttons[n].command){
						param.buttons[n].checked=false;
						_buttons[n].removeClass("simpleButtonChecked");
					}
				}else{
					if(obj.type==param.buttons[n].command){
						param.buttons[n].checked=true;
						_buttons[n].addClass("simpleButtonChecked");	
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
			_mouse3d.css({position:"absolute",top:"0px",width:param.width+"px",height:param.height+"px",left:"0px","text-align":"center"});
			if(_buttons.length>0){
				var usedLeft=(param.width*0.5)+130;
				var usedRight=(param.width*0.5)-130+param.height;
				for(var n=0;n<param.buttons.length;n++){
					var left=0;if(param.buttons[n].left){left=usedRight;}else{left=usedLeft;}
					_buttons[n].css({left:left+"px",height:param.height+"px",width:param.height+"px"})
					if(param.buttons[n].left){
						usedRight-=param.height;
					}else{
						usedLeft+=param.height;
					}
				}
			}
		}
		_this.alert=function(str){
			_alert.html(str);
		}
		return _this;
	}
})(jQuery);