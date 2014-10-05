function mouseup(e){
	
	//更新鼠标信息
	config.mouse.isDown=false;
	mouseUpdateUpPosition(e);
	stage.clearClass();
	
	//创建推拽出来的物体  TODO 待优化
	if(config.tool.indexOf("g_")>-1&&config.view=="3d"&&stage.$3d.isGridLocked()&&temporaryGeometry.mesh!=null){
		stage.scene.remove(temporaryGeometry.mesh);	
		temporaryGeometry.mesh=null;
		createGeometry({
			mouseDown:config.mouse.down_3d,
			mouseUp:config.mouse.up_3d,
			type:config.tool
		});
		return;
	}
	
	//morpher已经attach物体，选择关节
	if(morpher.isWorking()==1){
		var geo=stage.getMorpherJointByMouse(e,morpher.getJoints());
		if(geo) morpher.attachJoint(geo);
		return;
	}
	
	//morpher发生了拖动，同步2D物体和3D物体
	if(morpher.isChanged()){
		morpher.dragover(config.mouse.down_3d, config.mouse.up_3d);
		return;	
	}
	
	//transformer发生了拖动，同步2D物体和3D物体
	if(transformer.isChanged()){
		transformer.dragover([config.mouse.up_2d.x-config.mouse.down_2d.x,config.mouse.up_2d.y-config.mouse.down_2d.y],[config.mouse.up_3d.x-config.mouse.down_3d.x,config.mouse.up_3d.y-config.mouse.down_3d.y,config.mouse.up_3d.z-config.mouse.down_3d.z]);
		return;
	}
	
	//如果stage2d发生了摄像机移动，更新stage2d里面的物体，
	if(config.tool=="cameramove" && config.view!="3d" && stage.$2d.needRendering()){
		stage.$2d.fresh();
		return;
	}
	
	//transformer和morpher拾取物体
	if(config.tool=="transformer" || config.tool=="morpher"){
		var geo=stage.getGeometryByMouse(e);
		if(geo){
			(config.tool=="transformer")?transformer.attach(geo):morpher.attach(geo);
			affiliatedBar.show(config.tool);
		}
		return;
	}
}


function mousemove(e){
	
	//处理拖动
	if(config.mouse.isDown){ mousedragging(e); return;}
	
	//清空鼠标样式
	stage.clearClass();
	
	//显示鼠标位置
	informationBar.mousePosition({mouse3d:stage.getMousePosition()});
	
	//morpher已经attach物体，需要选择关节
	if(morpher.isWorking()==1){
		var geo=stage.getMorpherJointByMouse(e, morpher.getJoints());
		if(geo!=null) stage.addClass("workspace_move");
		return;
	}
	
	//morpher已经attach物体并且attach了关节
	if(morpher.isWorking()==2){
		if(e.target.tcType=="M2D") stage.addClass("workspace_"+e.target.tcCursor);
		return;	
	}
	
	//transformer已经工作，判断物体操控类型
	if(transformer.isWorking()){
		var geo=stage.getTransformerCommand(e);
		if(geo)	stage.addClass(geo.cursor);
		mouseUpdateUpPosition(e);
		return;
	}
	
	//变换器、变形器鼠标经过物体，变换鼠标样式以提示
	if(config.tool=="transformer" || config.tool=="morpher"){
		var geo=stage.getGeometryByMouse(e);
		if(geo) stage.addClass("workspace_pickup");
		mouseUpdateUpPosition(e);
		return;
	}
}


function mousedragging(e){
	
	//通过拖拽创建物体
	if(config.tool.indexOf("g_")>-1 && config.view=="3d" && stage.$3d.isGridLocked()){
		updateTemporaryGeometry(config.mouse.down_3d,config.mouse.up_3d);
		mouseUpdateUpPosition(e);
		return;
	}
	
	//处理摄像机拖动	
	if(config.tool=="cameramove"){
		stage.cameraMove(e.clientX-config.mouse.up_2d.x, e.clientY-config.mouse.up_2d.y);
		mouseUpdateUpPosition(e);
		return;
	}
	
	//处理transformer的拖动
	if(transformer.getCommand()!=null){
		var pos=stage.getMousePosition();
		transformer.dragging([e.clientX-config.mouse.up_2d.x,e.clientY-config.mouse.up_2d.y],[pos.x-config.mouse.up_3d.x,pos.y-config.mouse.up_3d.y,pos.z-config.mouse.up_3d.z]
		);
		mouseUpdateUpPosition(e);
		return;		
	}
	
	//处理morpher的拖动
	if(morpher.isWorking()==2 && config.view!="3d" && morpher.getCommand()!=null){
		var pos=stage.getMousePosition();
		morpher.dragging([e.clientX-config.mouse.up_2d.x,e.clientY-config.mouse.up_2d.y],[pos.x-config.mouse.up_3d.x,pos.y-config.mouse.up_3d.y,pos.z-config.mouse.up_3d.z]
		);
		mouseUpdateUpPosition(e);
		return;	
	}
}


function mousedown(e){
	
	//初始化鼠标信息
	config.mouse.isDown=true;
	config.mouse.down_2d.x=e.clientX;
	config.mouse.down_2d.y=e.clientY;
	config.mouse.down_3d=stage.getMousePosition();
	mouseUpdateUpPosition(e);
	
	//设置transformer命令
	if(transformer.isWorking()){
		var geo=stage.getTransformerCommand(e);
		if(geo){
			stage.addClass(geo.cursor);
			transformer.setCommand(geo.cmd);
		}
		return;	
	}
	
	//设置morpher拖拽器命令
	if(morpher.isWorking()==2 && e.target.tcType=="M2D"){
		morpher.setCommand(e.target.tcItem);
		return;	
	}
	
	//设置鼠标样式
	if(config.tool=="cameramove"){
		stage.addClass("workspace_move");
		return;
	}
}


function mouseUpdateUpPosition(e){
	config.mouse.up_3d=stage.getMousePosition();
	config.mouse.up_2d.x=e.clientX;
	config.mouse.up_2d.y=e.clientY;		
}


function mouseRightClick(e){
	transformer.detach();
	if(morpher.isWorking()==1) morpher.detach();
	if(morpher.isWorking()==2) morpher.detachJoint(true); 
	return false;
}