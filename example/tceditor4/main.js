/**
 * 全局变量
 */
/**UI*/
var ui = new UI(control_routing);
/**主编辑器*/
var stage = new Stage();
/**变换器，用于物体平移、缩放、旋转*/
var transformer = new Transformer(); //变换器，用于平移、旋转、缩放物体
/**变形器，也叫关节编辑器，通过修改物体关节来改变物体形状*/
var morpher = new Morpher();
/**光线系统，用于创建各种灯光*/
var light = new Light();
/**材质系统，用于创建各种材质*/
var material = new Material();
/**TODO：物体系统，用于创建各种物体*/
var temporaryGeometry = {
    mesh: null,
    material: null
};


/**
 * 启动入口
 */
function main() {
    // 检测运行环境
    if (!Detector.webgl) {
        document.body.innerHTML = '';
        document.body.style.color = '#000';
        document.body.style.backgroundColor = '#fff';
        Detector.addGetWebGLMessage();
    } else {
        // 初始化尺寸
        onResizeHandler();
        // 绑定组件之间的依赖
        stage.bind(
            $('#stage2d').Stage2D({
                width: config.width,
                height: config.height,
                clearColor: '#' + config.colors.renderer,
                gridColor: '#' + config.colors.grid,
                meshColor: '#' + config.colors.mesh,
                meshSelectColor: '#' + config.colors.select,
                meshHoverColor: '#' + config.colors.hover,
                showGrid: true
            }),
            $('#stage3d').Stage3D({
                width: config.width,
                height: config.height,
                clearColor: parseInt(config.colors.renderer, 16),
                gridColor: parseInt(config.colors.grid, 16),
                showGrid: true
            }),
            $('#cameraController').CameraController({
                width: 100,
                height: 100,
                showAxis: true,
                animate: true,
                language: config.language
            })
        );
        transformer.bind(stage);
        morpher.bind(stage);
        light.bind(stage);
        light.load(config.light);
        material.load(config.material);

        // 注册事件
        $(window)
            .bind('resize', onResizeHandler);
        $('#workspace')
            .bind('mousedown', mouseDownHandler)
            .bind('mouseup', mouseUpHandler)
            .bind('mousemove', mouseMoveHandler)
            .bind('contextmenu', mouseRightClickHandler);
        stage.addListener('onCameraChange', function(p, l, r) {
            ui.setCameraInfo(p, l, r);
            morpher.resizeJoint();
            light.update();
            light.update(true);
        });
        stage.addListener('onFresh', function() {
            morpher.reloadJoint();
            transformer.$2d.update();
        });
        stage.addListener('onMesh3DFresh', function() {
            morpher.reloadJoint();
            ui.reloadMeshVetrices(config.geometry.selected);
        });
        transformer.onFinish(function() {
            if (config.geometry.selected !== null) {
                ui.freshMeshPRS(
                    stage.getGeometryByID(config.geometry.selected)
                );
                ui.reloadMeshVetrices(config.geometry.selected);
            }
        });
        morpher.onChange(function(index) {
            ui.freshMeshVector(
                stage.getGeometryByID(config.geometry.selected),
                index
            );
        });

        // 手动刷新显示面板    
        stage.cameraMove(0, 0);
        ui.setColors('renderer', '#' + config.colors.renderer);
        ui.setColors('grid', '#' + config.colors.grid);
        ui.gridVisible(true);
        ui.addLights(light.children);
        ui.addMaterials(material.children);

        // TODO
        temporaryGeometry.material = material.get('temporary');
        addCube();
    }
}

function addCube() {

}


/**
 * 控制路由器
 * @param {Object} param 控制命令集
 */
function control_routing(param) {
    // 视图切换命令
    if (param.type == 'view' && config.view != param.cmd) {
        config.view = param.cmd;
        stage.changeTo(config.view);
        return;
    }
    // 一次性命令
    if (param.type == 'click' || param.type == 'change'){
        routing.interface(param);
        return;
    }
    // 状态持续命令
    // 命令：创建物体。切换回3D场景并让摄像机脱离侧视状态
    if (param.cmd.indexOf('g_') > -1) {
        if (!stage.$3d.isGridLocked())
            stage.cameraController.cameraAngleTo({a: 45});
        if (config.view != '3d') {
            config.view = '3d';
            stage.changeTo('3d');
            ui.changeView('3d');
        }
    }
    // 清空选择器
    selectGeometry(-1);
    // 设置命令
    config.tool = param.cmd;
}


/**
 * 选中一个物体，选中后更新UI中的相关显示面板
 * @param {string} id 物体id
 */
function selectGeometry(id) {
    if (id == -1) {
        config.geometry.selected = null;
        light.detach();
        transformer.detach();
        morpher.detach();
        ui.affiliatedBarShow();
        ui.selectMesh();
    } else if (config.geometry.selected == id) {
        return;
    } else {
        var geo = stage.getGeometryByID(id);
        if (
            geo && !geo.locked && (config.tool == 'transformer' || config.tool == 'morpher')
        ) {
            transformer.detach();
            morpher.detach();
            if (config.tool == 'transformer') {
                transformer.attach(geo);
            } else {
                morpher.attach(geo);
            }
            ui.affiliatedBarShow(config.tool);
            ui.selectMesh(id);
            config.geometry.selected = id;
        }
    }
}


/**
 * 浏览器大小改变时触发的事件句柄
 */
function onResizeHandler() {
    var win = $(window);
    config.width = win.width() - 301;
    config.height = win.height() - 72;
    $('#workspace').css({
        width: config.width + 'px',
        height: config.height + 'px'
    });
    $('#control').css({
        'width': config.width + 'px'
    });
    $('#affiliatedButtons').css({
        width: (config.width - 300) + 'px'
    });
    $('#stage3d').css({
        width: config.width + 'px',
        height: config.height + 'px'
    });
    $('#stage2d').css({
        width: config.width + 'px',
        height: config.height + 'px'
    });
    stage.resize(config.width, config.height);
}
