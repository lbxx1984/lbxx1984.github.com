/**
 * 主编辑器鼠标抬起事件处理句柄
 * @param {Object} e 事件对象
 */
function mouseUpHandler(e) {

    /**更新鼠标信息*/
    config.mouse.isDown = false;
    mouseUpdateUpPosition(e);
    stage.clearClass();
    
    /**创建推拽出来的物体  TODO 待优化*/
    if (
        config.tool.indexOf("g_") > -1 && config.view == "3d" &&
        stage.$3d.isGridLocked() && temporaryGeometry.mesh !== null
    ) {
        stage.scene.remove(temporaryGeometry.mesh);
        temporaryGeometry.mesh = null;
        createGeometry({
            mouseDown: config.mouse.down_3d,
            mouseUp: config.mouse.up_3d,
            type: config.tool
        });
        return;
    }
    
    /**morpher已经attach物体，尝试选择关节*/
    if (morpher.isWorking() === 1) {
        var geo = stage.getMorpherJointByMouse(e, morpher.getJoints());
        if (geo) {
            morpher.attachJoint(geo);
            ui.selectJoint(config.geometry.selected, geo.index);
        }
        return;
    }

    /**morpher发生了关节拖动，同步2D物体和3D物体*/
    if (morpher.isChanged()) {
        morpher.dragover(config.mouse.down_3d, config.mouse.up_3d);
        return;
    }

    /**transformer发生了拖动，同步2D物体和3D物体*/
    if (transformer.isChanged()) {
        transformer.dragover(
            [
                config.mouse.up_2d.x - config.mouse.down_2d.x,
                config.mouse.up_2d.y - config.mouse.down_2d.y
            ], [
                config.mouse.up_3d.x - config.mouse.down_3d.x,
                config.mouse.up_3d.y - config.mouse.down_3d.y,
                config.mouse.up_3d.z - config.mouse.down_3d.z
            ]
        );
        return;
    }

    /**stage2d摄像机发生了移动，更新stage2d里面的物体*/
    if (config.tool == "cameramove" && config.view != "3d") {
        stage.$2d.fresh();
        return;
    }

    /**尝试用transformer或morpher拾取物体*/
    if (
        (config.tool == "transformer" || config.tool == "morpher") &&
        !(transformer.isWorking() || morpher.isWorking())
    ) {
        var geo = stage.getGeometryByMouse(e);
        if (geo) selectGeometry(geo.tid);
        return;
    }
}


/**
 * 更新全局配置中的鼠标信息
 * @param {Object} e 鼠标事件对象
 */
function mouseUpdateUpPosition(e) {
    config.mouse.up_3d = stage.getMousePosition();
    config.mouse.up_2d.x = e.clientX;
    config.mouse.up_2d.y = e.clientY;
}


/**
 * 主编辑器鼠标移动事件处理句柄
 * @param {Object} e 鼠标事件对象
 */
function mouseMoveHandler(e) {

    /**处理拖动*/
    if (config.mouse.isDown) {
        mousedragging(e);
        return;
    }

    /**清空鼠标样式*/
    stage.clearClass();

    /**显示鼠标位置*/
    ui.setMousePosition({mouse3d: stage.getMousePosition()});

    /**morpher已经attach物体，尝试改变鼠标下关节的样式*/
    if (morpher.isWorking() == 1) {
        var geo = stage.getMorpherJointByMouse(e, morpher.getJoints());
        if (geo !== null) stage.addClass("workspace_move");
        return;
    }

    /**morpher已经attach物体，并已经attach关节，尝试根据鼠标下的具体操控部件改变鼠标样式*/
    if (morpher.isWorking() == 2) {
        if (e.target.tcType == "M2D") stage.addClass("workspace_" + e.target.tcCursor);
        return;
    }

    /**transformer已经工作，尝试根据transformer回传的具体操作类型改变鼠标样式*/
    if (transformer.isWorking()) {
        var geo = stage.getTransformerCommand(e);
        if (geo) stage.addClass(geo.cursor);
        mouseUpdateUpPosition(e);
        return;
    }

    /**还没有选择物体，如果系统命令带有选择物体的性质，根据鼠标下物体改变鼠标样式*/
    if (config.tool == "transformer" || config.tool == "morpher") {
        var geo = stage.getGeometryByMouse(e);
        if (geo) stage.addClass("workspace_pickup");
        mouseUpdateUpPosition(e);
        return;
    }
}


/**
 * 主编辑器鼠标拖拽操作处理句柄
 * @param {Object} e 鼠标事件对象
 */
function mousedragging(e) {

    /**拖拽创建物体*/
    if (config.tool.indexOf("g_") > -1 && config.view == "3d" && stage.$3d.isGridLocked()) {
        updateTemporaryGeometry(config.mouse.down_3d, config.mouse.up_3d);
        mouseUpdateUpPosition(e);
        return;
    }

    /**拖拽改变摄像机位置*/    
    if (config.tool == "cameramove") {
        stage.cameraMove(e.clientX - config.mouse.up_2d.x, e.clientY - config.mouse.up_2d.y);
        mouseUpdateUpPosition(e);
        return;
    }

    /**拖拽改变物体的位置、旋转、缩放*/
    if (transformer.getCommand() != null) {
        var pos = stage.getMousePosition();
        transformer.dragging(
            [
                e.clientX - config.mouse.up_2d.x,
                e.clientY - config.mouse.up_2d.y
            ], [
                pos.x - config.mouse.up_3d.x,
                pos.y - config.mouse.up_3d.y,
                pos.z - config.mouse.up_3d.z
            ]
        );
        mouseUpdateUpPosition(e);
        return;
    }

    /**拖拽改变物体关节的位置*/
    if (morpher.isWorking() == 2 && config.view != "3d" && morpher.getCommand() != null) {
        var pos = stage.getMousePosition();
        morpher.dragging(
            [
                e.clientX - config.mouse.up_2d.x,
                e.clientY - config.mouse.up_2d.y
            ], [
                pos.x - config.mouse.up_3d.x,
                pos.y - config.mouse.up_3d.y,
                pos.z - config.mouse.up_3d.z
            ]
        );
        mouseUpdateUpPosition(e);
        return;
    }
}


/**
 * 主编辑器鼠标按下事件处理句柄
 * @param {Object} e 事件对象
 */
function mouseDownHandler(e) {

    /**初始化鼠标信息*/
    config.mouse.isDown = true;
    config.mouse.down_2d.x = e.clientX;
    config.mouse.down_2d.y = e.clientY;
    config.mouse.down_3d = stage.getMousePosition();
    mouseUpdateUpPosition(e);

    /**transformer正在工作，设置transformer的拖拽命令*/
    if (transformer.isWorking()) {
        var geo = stage.getTransformerCommand(e);
        if (geo) {
            stage.addClass(geo.cursor);
            transformer.setCommand(geo.cmd);
        }
        return;
    }

    /**morpher已经attach关节，设置morpher的拖拽命令*/
    if (morpher.isWorking() == 2 && e.target.tcType == "M2D") {
        morpher.setCommand(e.target.tcItem);
        return;
    }

    /**如果系统命令是拖动移动摄像机，修改鼠标样式成四向箭头*/
    if (config.tool == "cameramove") {
        stage.addClass("workspace_move");
        return;
    }
}

/**
 * 主编辑器鼠标右键按下事件处理句柄
 * @param {Object} e 事件对象
 */
function mouseRightClickHandler(e) {
    light.detach();
    if (transformer.isWorking() || morpher.isWorking() == 1) selectGeometry(-1);
    if (morpher.isWorking() == 2) {
        morpher.detachJoint();
        ui.dropJoint();
    }
    return false;
}

