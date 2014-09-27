// JavaScript Document
//////////////////////////////stage2d
function stage2d_mousedown(e){
	//更新鼠标信息
	config.mouse.up_2d.x=config.mouse.down_2d.x=e.clientX;
	config.mouse.up_2d.y=config.mouse.down_2d.y=e.clientY;
	config.mouse.down_3d=stage2d.mousePosition();
	config.mouse.isDown=true;
	//摄像机拖拽预处理
	if(config.tool=="cameramove"){
		stage2d.addClass("workspace_pickup");
		return;
	}
	//骨骼拾取预处理
	if(config.tool=="joints" && e.target.tagName=="circle"){
		jointer2d.jointActive(e.target.index);
		return;
	}
}
function stage2d_mousemove(e){
	if(config.mouse.isDown){
		//关节拖拽处理
		if(config.tool=="joints" && jointer2d.isJointActive()){
			jointer2d.jointMove(
				e.clientX-config.mouse.up_2d.x,
				e.clientY-config.mouse.up_2d.y
			);
		}
		//更新鼠标信息
		config.mouse.up_3d=stage2d.mousePosition();
		config.mouse.up_2d.x=e.clientX;
		config.mouse.up_2d.y=e.clientY;	
		return;
	}else{
		//物体选择器和关节操作器的状态提示
		if(config.tool=="selector" || config.tool=="joints" ){
			if(e.target.tagName=="path"){
				stage2d.meshHover(e.target.index);
				stage2d.addClass("workspace_pickup");
			}else if(e.target.tagName=="circle"){
				jointer2d.jointHover(e.target.index);
				stage2d.addClass("workspace_joints");
			}else{
				jointer2d.jointHover(-1);
				stage2d.meshHover(-1);
				stage2d.removeClass("workspace_pickup");
				stage2d.removeClass("workspace_joints");
			}
		}
	}
}
function stage2d_mouseup(e){
	//更新鼠标信息
	config.mouse.up_2d.x=e.clientX;
	config.mouse.up_2d.y=e.clientY;
	config.mouse.up_3d=stage2d.mousePosition();
	config.mouse.isDown=false;	
	//摄像机拖拽结束
	if(config.tool=="cameramove"){
		stage2d.lookAt({
			x:config.mouse.up_2d.x-config.mouse.down_2d.x,
			y:config.mouse.down_2d.y-config.mouse.up_2d.y
		});
		stage2d.removeClass("workspace_pickup");
		return;	
	}
	//骨骼控制器释放
	if(config.tool=="joints"){
		if(e.target.tagName=="path"){
			stage2d.meshSetSelected(e.target.index);
			jointer2d.attach(e.target.index);
			jointer.attach(stage3d.children()[e.target.index]);
			affiliatedBar.show(config.tool);
		}
		if(jointer2d.isJointChanged()){
			jointer2d.jointChange(config.mouse.down_3d,config.mouse.up_3d);	
		}
		jointer2d.jointActive(null);
		return;
	}
}
function stage2d_mouserightclick(){
	if(jointer.isWorking()){
		if(jointer.isMoving()){
			jointer.clearJointController();
		}else{
			jointer.detach();
			jointer2d.detach();
			stage2d.meshClearSelected();
		}
	}
}






//////////////////////////////stage3d
function stage3d_mousedown(e){
	//记录当前鼠标信息
	config.mouse.up_3d=config.mouse.down_3d=stage3d.mousePosition();
	config.mouse.up_2d.x=config.mouse.down_2d.x=e.clientX;
	config.mouse.up_2d.y=config.mouse.down_2d.y=e.clientY;
	config.mouse.isDown=true;
}
function stage3d_mousemove(e){
	if(config.mouse.isDown){
		//执行拖拽处理	
		if(config.tool=="cameramove" && !cameraController.cameraRotated()){//平移摄像机
			stage3d.cameraLookAt(e.clientX-config.mouse.up_2d.x,e.clientY-config.mouse.up_2d.y);
		}
		if(config.tool.indexOf("g_")>-1 && config.view=="3d" && stage3d.isGridLocked()){//通过拖拽创建物体
			updateTemporaryGeometry(config.mouse.down_3d,config.mouse.up_3d);
		}
		//更新当前鼠标信息
		config.mouse.up_3d=stage3d.mousePosition();
		config.mouse.up_2d.x=e.clientX;
		config.mouse.up_2d.y=e.clientY;	
	}else{
		//选择器
		if(config.tool=="selector"){
			var geo=stage3d.selectGeometry();
			if(geo){
				stage3d.addClass("workspace_pickup");
			}else{
				stage3d.removeClass("workspace_pickup");
			}
			return;
		}
		//关节编辑器
		if(config.tool=="joints"){
			var geo=null;
			if(jointer.isWorking()){
			//已经选择了一个物体
				geo=stage3d.selectGeometry(jointer.getJoints());
				if(geo){
					stage3d.addClass("workspace_joints");
				}else{
					stage3d.removeClass("workspace_joints");
				}
			}else{
			//尚未选择物体	
				geo=stage3d.selectGeometry();
				if(geo){
					stage3d.addClass("workspace_pickup");
				}else{
					stage3d.removeClass("workspace_pickup");
				}
			}
		}
	}
}
function stage3d_mouseup(e){
	//更新鼠标信息
	config.mouse.up_3d=stage3d.mousePosition();	
	config.mouse.up_2d.x=e.clientX;
	config.mouse.up_2d.y=e.clientY;
	config.mouse.isDown=false;
	//通过拖拽创建物体
	if(temporaryGeometry.mesh!=null){
		scene3d.remove(temporaryGeometry.mesh);	
		temporaryGeometry.mesh=null;
		createGeometry({
			mouseDown:config.mouse.down_3d,
			mouseUp:config.mouse.up_3d,
			type:config.tool
		});
		return;
	}
	//为选择器绑定物体
	if(config.tool=="selector"){
		var geo = stage3d.selectGeometry();
		if(geo){
			selector.attach(geo);
			selector.setMode(config.selectorConfig.mode);
			selector.setSpace(config.selectorConfig.space);
			affiliatedBar.show(config.tool);
		}
		return;
	}
	//为关节控制器绑定物体
	if(config.tool=="joints"){
		var geo=null;
		if(jointer.isWorking()){
			geo=stage3d.selectGeometry(jointer.getJoints());
			if(geo){
				jointer.setJointController(selector,geo);
			}
		}else{
			geo=stage3d.selectGeometry();
			if(geo){
				jointer.attach(geo);
				stage2d.meshSetSelected(geo.id);
				jointer2d.attach(geo.id);
				affiliatedBar.show(config.tool);
			}
		}
		return;	
	}
}
function stage3d_mouserightclick(){
	if(jointer.isWorking()){
		if(jointer.isMoving()){
			jointer.clearJointController();
		}else{
			jointer.detach();
			jointer2d.detach();
			stage2d.meshClearSelected();
		}
	}
}