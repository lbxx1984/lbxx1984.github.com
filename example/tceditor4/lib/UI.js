function UI(callback){
	
	
//BEGIN	
var _this=this;
var _currentJoint=null;
var _currentMesh=null;
this.menuBar=$("#menu");
this.informationBar=$("#information");	
this.affiliatedBar=$("#affiliatedButtons");
this.controlBar=$("#control");
this.tabNavigator=$("#tabNavigator");
this.scene=$("SCENE");


//FUNC
var hideItem=function(event){
	var id=this.id.substr(1);
	var type=this.innerHTML.charAt(0);
	var inner=this.innerHTML.substr(1);
	type=(type=="▼")?"▶":"▼"
	this.innerHTML=type+inner;
	if(type=="▼"){
		$("#"+id).removeClass("tabItemHide");	
	}else{
		$("#"+id).addClass("tabItemHide");
	}
}
var inputChange=function(e){
	if(e.target.id.indexOf("mesh_")<0){
		var arr=e.target.id.split("_");
		var geo=stage.getGeometryByID(arr[0]);
		if(!geo) return;
		var x,y,z,obj;
		x=$("#"+arr[0]+"_"+arr[1]+"_x").val();
		y=$("#"+arr[0]+"_"+arr[1]+"_y").val();
		z=$("#"+arr[0]+"_"+arr[1]+"_z").val();
		if(isNaN(x)||isNaN(y)||isNaN(z)) return;
		obj={};
		obj.type="change";
		obj.cmd="mesh_joint";
		obj.geo=geo;
		obj.joint=Number(arr[1]);
		obj.value=[Number(x),Number(y),Number(z)];
		callback(obj);
	}else if(e.target.id.indexOf("mesh_")>-1){
		var geo=stage.getGeometryByID(config.geometry.selected);
		var value=Number(e.target.value);
		if(!geo || isNaN(value)) return;
		var obj={};
		obj.type="change";
		obj.cmd=e.target.id;
		obj.value=value;
		obj.geo=geo;
		obj.sync=$("#mesh_scale_sync")[0].checked;
		if(obj.cmd.indexOf("_s")>-1){
			if(obj.cmd=="mesh_sx"){
				obj.value=obj.value/geo.scale.x;
			}else if(obj.cmd=="mesh_sy"){
				obj.value=obj.value/geo.scale.y;	
			}else if(obj.cmd=="mesh_sz"){
				obj.value=obj.value/geo.scale.z;
			}
			if(obj.value==0) obj.value=1;
			if(obj.sync){
				var x=$("#mesh_sx"),y=$("#mesh_sy"),z=$("#mesh_sz")
				if(obj.cmd!="mesh_sx"){x.val((x.val()*obj.value).toFixed(2));}
				if(obj.cmd!="mesh_sy"){y.val((y.val()*obj.value).toFixed(2));}
				if(obj.cmd!="mesh_sz"){z.val((z.val()*obj.value).toFixed(2));}
			}
		}
		callback(obj);
		return;	
	}else{
		callback({type:"change",cmd:e.target.id,value:e.target.value});
	}
}
var itemClick=function(e){
	var id="", type="", value=null, dom=null;
	if(e.target.className.indexOf("listitem")>-1){
		dom=e.target;
	}else{
		dom=e.target.parentNode;
	}
	if(e.target.className.indexOf("visible")>-1){
		if(e.target.className.indexOf("active2")>-1){
			e.target.className="visibleButton";
			type="mesh_visible";
		}else{
			e.target.className="visibleButton active2";	
			type="mesh_hide";	
		}
	}else if(e.target.className.indexOf("lock")>-1){
		if(e.target.className.indexOf("active2")>-1){
			e.target.className="lockButton";
			type="mesh_lock";
		}else{
			e.target.className="lockButton active2";	
			type="mesh_unlock";	
		}		
	}else if(e.target.className.indexOf("trash")>-1){
		type="mesh_trash";		
	}else{
		type="mesh_select";		
	}
	id=dom.id;
	callback({type:"click",cmd:type,value:id,dom:dom});
}


//SCENE
this.scene.addItem=function(type,id){
	if(!type || !id) return;
	$("#"+type+"list").append(
		'<div class="listitem" id="'+id+'">'+
			'<div class="visibleButton">&nbsp;</div>'+
			'<div class="lockButton active2">&nbsp;</div>'+
			'<div class="itemTitle">'+id+'</div>'+
			'<div class="trashButton">&nbsp;</div>'+
		'</div>'
	);
	$("#mesh_select").append("<option text='"+id+"'>"+id+"</option>");
}
this.scene.selectJoint=function(geo,joint){
	_currentMesh=geo;_currentJoint=joint;
	$("#"+geo+"_"+joint+"_x").attr("type","number").removeAttr("readonly");
	$("#"+geo+"_"+joint+"_y").attr("type","number").removeAttr("readonly");
	$("#"+geo+"_"+joint+"_z").attr("type","number").removeAttr("readonly");	
}
this.scene.dropJoint=function(){
	$("#"+_currentMesh+"_"+_currentJoint+"_x").attr("type","text").attr("readonly",true);
	$("#"+_currentMesh+"_"+_currentJoint+"_y").attr("type","text").attr("readonly",true);
	$("#"+_currentMesh+"_"+_currentJoint+"_z").attr("type","text").attr("readonly",true);
	_currentMesh=null;
	_currentJoint=null;		
}
this.scene.selectMesh=function(id){
	$("#meshlist>div").removeClass("active");
	if(id!=null){
		$("#"+id).addClass("active");
		_this.scene.setMeshInformation(id);
	}
}
this.scene.setMeshInformation=function(id){
	var geo=stage.getGeometryByID(id);
	if(!geo) return;
	$("#mesh_select").val(id).css({"width":"150px","text-align":"left"});
	_this.scene.freshMeshPRS(geo);
	_this.scene.freshMeshVertices(geo);
	_this.scene.freshMeshFaces(geo);
}
this.scene.setCameraInformation=function(p,l,r){
	$("#camera_px").val(p.x.toFixed(2));
	$("#camera_py").val(p.y.toFixed(2));
	$("#camera_pz").val(p.z.toFixed(2));
	$("#camera_lx").val(l.x.toFixed(2));
	$("#camera_ly").val(l.y.toFixed(2));
	$("#camera_lz").val(l.z.toFixed(2));
	$("#camera_r").attr("max",r.b).attr("min",r.a).val(r.r);
}
this.scene.setColors=function(p,v){
	$("#"+p+"_color").val(v);	
}
this.scene.gridVisible=function(v){
	var d=$("#grid_visible")[0];
	if(v==null){
		if(d.checked){
			d.checked=false;	
		}else{
			d.checked=true;	
		}
	}else{
		d.checked=v;
	}
}
this.scene.freshMeshPRS=function(geo){
	if(!geo) return;	
	$("#mesh_px").val(geo.position.x.toFixed(2));
	$("#mesh_py").val(geo.position.y.toFixed(2));
	$("#mesh_pz").val(geo.position.z.toFixed(2));
	$("#mesh_rx").val(parseInt(geo.rotation.x*57.3));
	$("#mesh_ry").val(parseInt(geo.rotation.y*57.3));
	$("#mesh_rz").val(parseInt(geo.rotation.z*57.3));
	$("#mesh_sx").val(geo.scale.x.toFixed(2));
	$("#mesh_sy").val(geo.scale.y.toFixed(2));	
	$("#mesh_sz").val(geo.scale.z.toFixed(2));		
}
this.scene.freshMeshVector=function(geo,index){
	if(!geo) return;
	var matrix=tcMath.rotateMatrix(geo);
	var v=geo.geometry.vertices[index];
	var pos=tcMath.Local2Global(v.x,v.y,v.z,matrix,geo);
	$("#"+geo.id+"_"+index+"_x").val(pos[0].toFixed(2));
	$("#"+geo.id+"_"+index+"_y").val(pos[1].toFixed(2));
	$("#"+geo.id+"_"+index+"_z").val(pos[2].toFixed(2));
}
this.scene.freshMeshVertices=function(geo){
	if(!geo) return;	
	var l=$("#vectorlist"),i="",v=null,n,matrix,pos;
	//显示世界坐标，本地坐标没意义，变换时进行换算就可以了。
	l.html('');
	matrix=tcMath.rotateMatrix(geo);
	for(n=0;n<geo.geometry.vertices.length;n++){
		if(n<10){i="00";}else if(n<100){i="0";}else{i="";}
		v=geo.geometry.vertices[n];
		pos=tcMath.Local2Global(v.x,v.y,v.z,matrix,geo);
		l.append(
			'<span>No.'+i+n+':</span>'+
			'<input type="text" readonly id="'+geo.id+'_'+n+'_x" value="'+pos[0].toFixed(2)+'"/>'+
			'<input type="text" readonly id="'+geo.id+'_'+n+'_y" value="'+pos[1].toFixed(2)+'"/>'+
			'<input type="text" readonly id="'+geo.id+'_'+n+'_z" value="'+pos[2].toFixed(2)+'"/><br>'
		);	
	}
}
this.scene.freshMeshFaces=function(geo){
	if(!geo) return;	
	var l=$("#facelist"),i="",v=null,n;
	l.html('');
	for(n=0;n<geo.geometry.faces.length;n++){
		if(n<10){i="00";}else if(n<100){i="0";}else{i="";}
		v=geo.geometry.faces[n];
		l.append(
			'<span>No.'+i+n+':</span>'+
			'<input type="text" readonly value="'+v.a+'"/>'+
			'<input type="text" readonly value="'+v.b+'"/>'+
			'<input type="text" readonly value="'+v.c+'"/><br>'
		);
	}
}
$("#MESH input").bind("change",inputChange)
$("#SCENE input").bind("change",inputChange);
$("#vectorlist").bind("change",inputChange);
$("#meshlist").bind("click",itemClick);

//tabContent
$("#tabNavigator li").bind("click",function(event){
	if(this.parentNode.currentActive==null) this.parentNode.currentActive=this.parentNode.firstChild;
	$(this.parentNode.currentActive).removeClass("active");	
	this.parentNode.currentActive=this;
	$(this.parentNode.currentActive).addClass("active");	
	$("#tabContent>div").addClass("tabItemHide");
	var id=$(this).text().replace(/[^a-z]/ig,"");
	$("#"+id).removeClass("tabItemHide");
});
$("#SCENE label").bind("click",hideItem);
$("#MESH label").bind("click",hideItem);


//controlBar
this.controlBar.changeView=function(view){
	$("#control").find("div[id^='view']").removeClass("active");
	$("#view_"+view).addClass("active");		
}
$("#control").bind("click",function(event){
	if(event.target.id==null) return;
	var arr=event.target.id.split("_");
	if(arr[0]=="view" || arr[0]=="tool"){
		$(this).find("div[id^='"+arr[0]+"']").removeClass("active");	
		$(event.target).addClass("active");
		callback({type:arr[0],cmd:arr[1]});		
	}else{
		if(event.target.id=="grid_show"){
			event.target.data_hidden=!event.target.data_hidden;	
			if(event.target.data_hidden){
				$(event.target).addClass("grid_hidden");
				callback({type:"click",cmd:"grid_hidden"});	
			}else{
				$(event.target).removeClass("grid_hidden");
				callback({type:"click",cmd:"grid_show"});	
			}
		}else{
			callback({type:"click",cmd:event.target.id});
		}
	}
});	


//affiliatedBar
this.affiliatedBar.show=function(type){
	_this.affiliatedBar.css({"display":"block"});
	_this.affiliatedBar.find("div,span").css("display","none");
	_this.affiliatedBar.find("[id^='"+type+"']").css("display","inline-block");	
}
this.affiliatedBar.hide=function(){
	_this.affiliatedBar.css({"display":"none"});
}
$("#affiliatedButtons").bind("click",function(event){
	if(event.target.id==null) return;
	var arr=event.target.id.split("_");
	if(arr.length==3 && arr[0]=="transformer"){
		$(this).find("div[id^='"+arr[0]+"']").removeClass("active");
		$(event.target).addClass("active");
		callback({type:"click",cmd:arr[0]+"_"+arr[1]});	
	}else if(arr[1]=="world"){
		var tag=$(event.target),key="world";
		tag.removeClass("transformer_world");
		tag.removeClass("transformer_local");
		if(tag[0].current==1){
			tag[0].current=0;
			tag.addClass("transformer_world");
		}else{
			tag[0].current=1;
			key="local"
			tag.addClass("transformer_local");
		}
		var r=callback({type:"click",cmd:arr[0]+"_"+key});
		if(r){
			tag.removeClass("transformer_world");
			tag.removeClass("transformer_local");
			if(tag[0].current==1){
				tag[0].current=0;
				tag.addClass("transformer_world");
			}else{
				tag[0].current=1;
				tag.addClass("transformer_local");
			}
		}
	}else{
		callback({type:"click",cmd:arr[0]+"_"+arr[1]});	
	}
});


//informationBar
this.informationBar.alert=function(str){
	_this.informationBar.html(str);
}
this.informationBar.mousePosition=function(pos){
	_this.informationBar.html(
		"x:"+parseInt(pos.mouse3d.x)+" y:"+parseInt(pos.mouse3d.y)+" z:"+parseInt(pos.mouse3d.z)
	);
}	


//menuBar
$("#menu").bind("mouseleave",function(event){
	_this.menuBar.find("div").css({"display":"none"});	
});
$("#menu>ul>li").bind("mousemove",function (event){
	if(this.parentNode.parentNode.current) $("#"+this.parentNode.parentNode.currentShow).css("display","none");
	this.parentNode.parentNode.current=event.target.innerHTML.replace(/[^a-z]/ig,"");
	$("#"+this.parentNode.parentNode.current).css({"display":"block","left":$(this).offset().left+"px"});		
});
$("#menu .menuitem").bind("click",function(event){
	if(event.target.id.indexOf("g_")>-1){
		callback({type:"tool",cmd:event.target.id});
		_this.controlBar.find("div[id^='tool']").removeClass("active");	
	}
});


//END
}