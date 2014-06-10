// JavaScript Document

function main(border,container){
	
	var _win=$(border);
	var _width=_win.width();
	var _height=_win.height();
	var _current=0;
	var _slider=null;
	var _timer=null;
	
	
	var _container=$("<div>")
	.css({position:"absolute",top:"120px",left:"0px",width:_width+"px",height:(_height-120)+"px","background-color":"#202020",overflow:"hidden"})
	.addClass("main")
	.appendTo(container);
		
	$(border).bind("resize",function(){
		_width=_win.width();
		_height=_win.height();	
		_container.css({width:_width+"px",height:(_height-120)+"px"}).perfectScrollbar("update");
		refresh();
	});



	homepage();
	_container.perfectScrollbar({ 
		wheelSpeed: 20,
		wheelPropagation: true,
  		minScrollbarLength: 20
	});
	_timer=setInterval(clock,4000);
	
		

	function homepage(){
		
		_slider=$("<div>")
		.css({position:"absolute",width:"740px",height:"280px",top:"10px",left:(_width-1000)*0.5+"px"})
		.appendTo(_container)
		.slider(config.slider);

		var welcomeTo=$("<div>")
		.html("<hr>")
		.addClass("application")
		.css({position:"absolute",width:"740px",height:"200px",top:"300px",left:(_width-1000)*0.5+"px"})
		.css({padding:"0px"})
		.appendTo(_container);
		
		$("<div>")
		.html("欢迎来到LHTSOFT")
		.appendTo(welcomeTo)
		.css({color:"#F1F1F1","font-size":"30px"});
		
		$("<img>")
		.attr("src","images/logo2.gif")
		.css({width:"175px",height:"140px",position:"absolute",left:"5px",top:"55px"})
		.appendTo(welcomeTo);
		
		$("<div>")
		.html(config.welcome)
		.css({position:"absolute",width:"555px",height:"140px",top:"55px",left:"190px"})
		.appendTo(welcomeTo)
		
		$("<div>")
		.addClass("application")
		.html('<hr><table><tr style="font-size:16px;color:#F1F1F1;"><td width="200px">Lhtsoft</td><td width="200px">Connect</td><td width="200px">About Us</td><td width="200px">Support</td></tr><tr valign="top"><td>Products</td><td>Blog<br>Weibo<br>Twitter<br>Facebook</td><td>Company<br>Our Team<br>Jobs</td><td>Terms<br>Privacy<br>Contact Us</td></tr></table>')
		.css({position:"absolute",width:"740px",height:"200px",top:"510px",left:(_width-1000)*0.5+"px"})
		.css({padding:"0px"})
		.appendTo(_container);

		var newProduce=$("<div>")
		.addClass("application")
		.css({position:"absolute",width:"250px",height:"700px",top:"0px",left:(_width-1000)*0.5+750+"px"})
		.css({padding:"0px","padding-left":"10px","border-left":"1px solid #CDCDCD"})
		.appendTo(_container);
		
		$("<div>")
		.html("最近项目")
		.appendTo(newProduce)
		.css({color:"#F1F1F1","font-size":"30px","text-align":"left"});
		
		$("<img>")
		.attr("src","images/p2.png")
		.css({position:"absolute",width:"250px",height:"160px",left:"10px",top:"40px"})
		.appendTo(newProduce)
		
		$("<div>")
		.html(config.newapp[0])
		.css({position:"absolute",width:"250px",height:"160px",top:"210px",left:"10px"})
		.appendTo(newProduce)
		
		$("<img>")
		.attr("src","images/p1.png")
		.css({position:"absolute",width:"250px",height:"160px",left:"10px",top:"365px"})
		.appendTo(newProduce)
		
		$("<div>")
		.html(config.newapp[1])
		.css({position:"absolute",width:"250px",height:"160px",top:"535px",left:"10px"})
		.appendTo(newProduce)
		
		copyright(720);
	}
	
	function applications(){	
		for(var n=0;n<config.applications.length;n++){
			$("<div>")
			.addClass("application")
			.css({
				position:"absolute",
				width:"1000px",
				height:"80px",
				top:10+n*130+"px",
				left:(_width-1000)*0.5+"px"
			})
			.html('<a target="_blank" href="'+config.applications[n].url+'">'+config.applications[n].label+'</a><br><hr>'+config.applications[n].introduction)
			.appendTo(_container);
		}
		copyright(30+config.applications.length*130);
	}
	
	function member(){
		for(var n=0;n<config.team.length;n++){
			var box=$("<div>")
			.addClass("application")
			.css({
				position:"absolute",
				width:"700px",
				height:"150px",
				top:10+n*200+"px",
				left:(_width-700)*0.5+"px"
			})
			.appendTo(_container);
			var img=$("<img>")
			.addClass("face")
			.attr("src","images/"+config.team[n].url)
			.css({position:"absolute",width:"150px",height:"150px"})
			.appendTo(box);
			var intro=$("<div>")
			.html(config.team[n].intro)
			.css({
				position:"absolute",
				width:"520px",
				height:"150px",
				top:"20px",
				left:"200px"
			})
			.appendTo(box)
		}
		copyright(30+config.team.length*200);
	}
	
	function about(){
		$("<div>")
		.html(config.about)
		.css({
			position:"absolute",
			width:"700px",
			height:"150px",
			top:"10px",
			left:(_width-700)*0.5+"px"
		})
		.appendTo(_container);	
		copyright(500);
	}
	
	function copyright(y){
		$("<div>")
		.html(config.copyright)
		.addClass("copyright")
		.css({
			position:"absolute",
			width:"1000px",
			height:"30px",
			top:y+"px",
			left:(_width-1000)*0.5+"px"
		})
		.appendTo(_container)
	}
	
	function clock(){
		if(_slider){_slider.beep();}
	}
	
	function refresh(){
		_container.empty().perfectScrollbar("destroy");
		if(_current==0){homepage();}else{_slider=null;}
		if(_current==1){applications();}
		if(_current==2){member();}
		if(_current==3){about();}
		_container.perfectScrollbar({ 
			wheelSpeed: 20,
			wheelPropagation: true,
  			minScrollbarLength: 20
		});		
	}
	
	return {
		display:function(index){
			if(_current==index){return;}else{_current=index;}
			refresh();
		}
	}
}