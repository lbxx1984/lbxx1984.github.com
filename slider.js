(function($){

	$.fn.slider = function(param){
		
		var _this=this;
		var _current=0;
		var _button=[];
		var _moving=false;
		
		_this.css({overflow:"hidden"})	

		_picContainer=$("<div>")
		.css({
			position:"absolute",
			height:(_this.height()-10)+"px",
			width:_this.width()*param.length+"px",
			left:"0px",
			top:"0px"
		})
		.appendTo(_this);
		
		_msgContainer=$("<div>")
		.css({
			position:"absolute",
			height:"40px",
			width:_this.width()+"px",
			left:"0px",
			bottom:"10px",
			"line-height":"40px",
			"padding-left":"20px",
			"background-color":"rgba(0,0,0,0.5)"	
		})
		.appendTo(_this)
		
		for(var n=0;n<param.length;n++){
			$("<img>")
			.attr("src","images/"+param[n].img+"")
			.css({
				position:"absolute",
				height:(_this.height()-10)+"px",
				width:_this.width()+"px",
				left:_this.width()*n+"px",
				top:"0px"
			})
			.appendTo(_picContainer);
			

			var btn=$("<div>")
			.addClass("sliderBtn")
			.css({
				position:"absolute",
				height:"9px",
				width:"30px",
				right:31*n+"px",
				bottom:"0px"
			})
			.bind("click",function(){move(this.index);})
			.appendTo(_this);
			
			btn[0].index=n;
			_msgContainer.html('<a href="'+param[0].url+'" target="_blank">'+param[0].label+'</a>');
			_button.push(btn);
			_button[_current].removeClass("sliderBtn").addClass("sliderActiveBtn");	
					
		}
		
		function move(index){
			if(_moving || index == _current){return;}
			if(index>=_button.length){index=0;}
			_button[_current].removeClass("sliderActiveBtn").addClass("sliderBtn");	
			_current=index;
			_moving=true;
			_picContainer.animate({left:-_this.width()*index+"px"},"slow",null,function(){
				_moving=false;
				_msgContainer.html('<a href="'+param[index].url+'" target="_blank">'+param[index].label+'</a>');
			});
			_button[_current].removeClass("sliderBtn").addClass("sliderActiveBtn");	
		}
		
		_this.beep=function(){move(_current+1);}
		
		return _this;
	}
})(jQuery);