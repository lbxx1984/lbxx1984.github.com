(function($){
	/*
		浏览器版本
		jQuery1.9去掉了浏览器版本这一块，所以补上
	*/
	$.browser=function(){
		var Sys={};  
		var ua = navigator.userAgent.toLowerCase();  
		var s;  
   			(s=ua.match(/msie ([\d.]+)/))?Sys.ie=s[1].split(".")[0]:  
   			(s=ua.match(/firefox\/([\d.]+)/))?Sys.firefox=s[1].split(".")[0]:  
   			(s=ua.match(/chrome\/([\d.]+)/))?Sys.chrome=s[1].split(".")[0]:  
   			(s=ua.match(/opera.([\d.]+)/))?Sys.opera=s[1].split(".")[0]:  
  			(s=ua.match(/version\/([\d.]+).*safari/))?Sys.safari =s[1].split(".")[0]:0;  
		if(Sys.ie){return ['ie',Sys.ie]} 
		if(Sys.firefox){return ['firefox',Sys.firefox]}   
		if(Sys.chrome){return ['chrome',Sys.chrome]}  
		if(Sys.opera){return ['opera',Sys.opera]}  
		if(Sys.safari){return ['safari',Sys.safari]} 
	}
})(jQuery);