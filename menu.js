// JavaScript Document

function menu(border,container,callback){
	
	var _win=$(border);
	var _width=_win.width();
	var _height=_win.height();
	var _callback=callback;
	
	var _container=$("<div>")
		.css({
			position:"absolute",
			top:"0px",
			left:"0px",
			width:_width+"px",
			height:"120px",
			"background-color":"#1A1A1A",
			overflow:"hidden"
		})
		.addClass("main")
		.appendTo(container);
	var _menuBg=$("<div>")
		.css({
			position:"absolute",
			top:"90px",
			left:"0px",
			width:_width+"px",
			height:"30px",
			"background-color":"#333333",
			overflow:"hidden"
		})
		.appendTo(_container);	
	var _logo=$("<img>")
		.attr("src","images/logo.png")
		.css({
			width:"300px",
			height:"70px",
			top:"8px",
			left:(_width-300)*0.5+"px",
			position:"absolute"	
		})
		.appendTo(_container);
		
	var _menu=$("<div>")
		.css({
			width:config.menu.length*100+"px",
			height:"30px",
			top:"90px",
			left:(_width-config.menu.length*100)*0.5+"px",
			position:"absolute"
		})
		.appendTo(_container);
	
	for(var n=0;n<config.menu.length;n++){
		$("<div>")
		.addClass("menu")
		.css({
			width:"100px",
			height:"30px",
			top:"0px",
			left:(100*n)+"px",
			position:"absolute",
			"line-height":"30px",
			"text-align":"center"
		})
		.html(config.menu[n][config.language])
		.appendTo(_menu)
		.bind("click",function(){
			if(typeof(_callback)=="function"){_callback(this.index);}
		})[0].index=n;	
	}
	
	$(border).bind("resize",function(){
		_width=_win.width();
		_height=_win.height();	
		_container.css({width:_width+"px"});
		_menuBg.css({width:_width+"px"});
 		_logo.css({left:(_width-300)*0.5+"px"});
		_menu.css({left:(_width-config.menu.length*100)*0.5+"px"});
	});
}