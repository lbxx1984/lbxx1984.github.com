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
	//选择器预处理
	if(config.tool=="selector" && e.target.tcType=="T2D"){
		selector2d.setCtrl(e.target.tcItem);
		return;	
	}
}
function stage2d_mousemove(e){
	if(config.mouse.isDown){
		//关节拖拽处理
		var pos=stage2d.mousePosition();
		if(config.tool=="joints" && jointer2d.isJointActive()){
			jointer2d.jointMove(
				e.clientX-config.mouse.up_2d.x,
				e.clientY-config.mouse.up_2d.y
			);
		}
		//选择器拖拽处理
		if(config.tool=="selector" && selector2d.getCtrl()!=null){
			var pos=stage2d.offset();
			selector2d.moving(
				[
					e.clientX-config.mouse.up_2d.x,
					e.clientY-config.mouse.up_2d.y
				],[
					pos.x-config.mouse.up_3d.x,
					pos.y-config.mouse.up_3d.y,
					pos.z-config.mouse.up_3d.z
				],[
					e.clientX-pos.left,
					e.clientY-pos.top
				]
			);	
		}
		
		//更新鼠标信息
		config.mouse.up_3d=stage2d.mousePosition();
		config.mouse.up_2d.x=e.clientX;
		config.mouse.up_2d.y=e.clientY;	
		return;
	}else{
		stage2d.removeClass();
		//物体选择器和关节操作器的状态提示
		if(config.tool=="selector" || config.tool=="joints" ){
			//选择器部件提示
			if(e.target.tcType=="T2D"){
				stage2d.addClass("workspace_"+e.target.tcCursor);
				return;	
			}
			//普通物体提示
			if(e.target.tagName=="path"){
				stage2d.addClass("workspace_pickup");
				stage2d.meshHover(e.target.index);
			}else if(e.target.tagName=="circle"){
				stage2d.addClass("workspace_joints");
				jointer2d.jointHover(e.target.index);
			}else{
				jointer2d.jointHover(-1);
				stage2d.meshHover(-1);
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
	stage2d.removeClass();	
	//摄像机拖拽释放
	if(config.tool=="cameramove"){
		stage2d.lookAt({
			x:config.mouse.up_2d.x-config.mouse.down_2d.x,
			y:config.mouse.down_2d.y-config.mouse.up_2d.y
		});
		return;	
	}
	//骨骼控制器
	if(config.tool=="joints"){
		//骨骼拖拽控制释放
		if(jointer2d.isJointChanged()){
			jointer2d.jointChange(config.mouse.down_3d,config.mouse.up_3d);	
			jointer2d.jointActive(null);
			return;
		}
		//普通骨骼选择动作
		if(e.target.tagName=="path"){
			stage2d.meshSetSelected(e.target.index);
			jointer2d.attach(e.target.index);
			jointer.attach(stage3d.children()[e.target.index]);
			affiliatedBar.show(config.tool);
		}
		return;
	}
	//选择器
	if(config.tool=="selector"){
		//选择器控制单元拖动释放
		if(selector2d.isChanged()){
			selector2d.moved(
				[
					config.mouse.up_2d.x-config.mouse.down_2d.x,
					config.mouse.up_2d.y-config.mouse.down_2d.y
				],[
					config.mouse.up_3d.x-config.mouse.down_3d.x,
					config.mouse.up_3d.y-config.mouse.down_3d.y,
					config.mouse.up_3d.z-config.mouse.down_3d.z
				]
			);
			return;	
		}
		//普通选择动作
		if(e.target.tagName=="path"){
			stage2d.meshSetSelected(e.target.index);
			selector2d.attach(e.target.index);
			selector.attach(stage3d.children()[e.target.index]);
			selector.setMode(config.selectorConfig.mode);
			selector.setSpace(config.selectorConfig.space);
			affiliatedBar.show(config.tool);
		}
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
	if(selector2d.isWorking()){
		selector.detach();	
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
		if(config.tool=="cameramove" && !cameraController.cameraRotated()){
			//平移摄像机
			stage3d.cameraLookAt(e.clientX-config.mouse.up_2d.x,e.clientY-config.mouse.up_2d.y);
		}
		if(config.tool.indexOf("g_")>-1 && config.view=="3d" && stage3d.isGridLocked()){
			//通过拖拽创建物体
			updateTemporaryGeometry(config.mouse.down_3d,config.mouse.up_3d);
		}
		//更新当前鼠标信息
		config.mouse.up_3d=stage3d.mousePosition();
		config.mouse.up_2d.x=e.clientX;
		config.mouse.up_2d.y=e.clientY;	
	}else{
		stage3d.removeClass();
		//选择器
		if(config.tool=="selector"){
			var geo=stage3d.selectGeometry();
			if(geo) stage3d.addClass("workspace_pickup");
			return;
		}
		//关节编辑器
		if(config.tool=="joints"){
			var geo=null;
			if(jointer.isWorking()){
				//已经选择了一个物体
				geo=stage3d.selectGeometry(jointer.getJoints());
				if(geo) stage3d.addClass("workspace_joints");
			}else{
				//尚未选择物体
				geo=stage3d.selectGeometry();
				if(geo) stage3d.addClass("workspace_pickup");
			}
			return;
		}
	}
}
function stage3d_mouseup(e){
	//更新鼠标信息
	config.mouse.up_3d=stage3d.mousePosition();	
	config.mouse.up_2d.x=e.clientX;
	config.mouse.up_2d.y=e.clientY;
	config.mouse.isDown=false;
	stage3d.removeClass();
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
			stage2d.meshSetSelected(geo.id);
			selector2d.attach(geo.id);
			affiliatedBar.show(config.tool);
		}
		return;
	}
	//为关节控制器绑定物体
	if(config.tool=="joints"){
		var geo=null;
		if(jointer.isWorking()){
			geo=stage3d.selectGeometry(jointer.getJoints());
			if(geo) jointer.setJointController(selector,geo);
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