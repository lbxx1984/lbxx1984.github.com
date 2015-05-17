/**
 * 灯光控制路由
 */
var light_routing = {
    /**
     * 选中灯光
     * @param {number} param.value 灯光id
     */
    select: function(param) {
        light.attach(param.value);
    },
    /**
     * 删除灯光
     * @param {number} param.value 灯光id
     * @param {DOM} param.dom 灯光对应的界面按钮
     */
    trash: function(param) {
        if (confirm(config.msg[config.language].deleteLight)) {
            if (param.value == light.selected) light.detach();
            light.delete(param.value);
            param.dom.parentNode.removeChild(param.dom);
        }
    },
    /**
     * 锁定灯光
     * @param {number} param.value 灯光id
     */
    lock: function(param) {
        light.lock(param.value);
    },
    /**
     * 解锁灯光
     * @param {number} param.value 灯光id
     */
    unlock: function(param) {
        light.unlock(param.value);
    },
    /**
     * 隐藏灯光
     * @param {number} param.value 灯光id
     */
    hide: function(param) {
        light.hide(param.value);
    },
    /**
     * 显示灯光
     * @param {number} param.value 灯光id
     */
    visible: function(param) {
        light.visible(param.value);
    }
};


/**
 * 物体控制路由
 */
var mesh_routing = {
    /**
     * 修改物体关节的位置
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.joint 物体关节的索引号
     * @param {array} param.value 物体关节的新位置，本地坐标。[x, y, z]
     */
    joint: function(param) {
        stage.meshTransform(param.geo, 'joint', param.joint, param.value);
    },
    /**
     * 修改物体的x向缩放
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.value 新的缩放比例
     * @param {boolean} param.sync x、y、z三向是否同步
     */
    sx: function(param) {
        stage.meshTransform(param.geo, 'scale', 'x', param.value, param.sync);
    },
    /**
     * 修改物体的y向缩放
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.value 新的缩放比例
     * @param {boolean} param.sync x、y、z三向是否同步
     */
    sy: function(param) {
        stage.meshTransform(param.geo, 'scale', 'y', param.value, param.sync);
    },
    /**
     * 修改物体的z向缩放
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.value 新的缩放比例
     * @param {boolean} param.sync x、y、z三向是否同步
     */
    sz: function(param) {
        stage.meshTransform(param.geo, 'scale', 'z', param.value, param.sync);
    },
    /**
     * 修改物体的x向旋转
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.value 新的旋转角度，不是弧度，取值范围[0,360]
     */
    rx: function(param) {
        stage.meshTransform(param.geo, 'rotation', 'x', param.value / 57.3);
    },
    /**
     * 修改物体的y向旋转
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.value 新的旋转角度，不是弧度，取值范围[0,360]
     */
    ry: function(param) {
        stage.meshTransform(param.geo, 'rotation', 'y', param.value / 57.3);
    },
    /**
     * 修改物体的z向旋转
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.value 新的旋转角度，不是弧度，取值范围[0,360]
     */
    rz: function(param) {
        stage.meshTransform(param.geo, 'rotation', 'z', param.value / 57.3);
    },
    /**
     * 修改物体在世界中的x轴位置
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.value 位置值
     */
    px: function(param) {
        stage.meshTransform(param.geo, 'position', 'x', param.value);
    },
    /**
     * 修改物体在世界中的y轴位置
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.value 位置值
     */
    py: function(param) {
        stage.meshTransform(param.geo, 'position', 'y', param.value);
    },
    /**
     * 修改物体在世界中的z轴位置
     * @param {Object} param.geo 待操作3D物体
     * @param {number} param.value 位置值
     */
    pz: function(param) {
        stage.meshTransform(param.geo, 'position', 'z', param.value);
    },
    /**
     * 选择物体
     * @param {number} param.value 物体id
     */
    select: function(param) {
        selectGeometry(param.value);
    },
    /**
     * 删除物体
     * @param {number} param.value 物体id
     * @param {DOM} param.dom 物体对应的在界面上的按钮
     */
    trash: function(param) {
        if (confirm(config.msg[config.language].deleteMesh)) {
            if (param.value == config.geometry.selected) selectGeometry(-1);
            stage.meshDelete(param.value);
            ui.selectMesh();
            param.dom.parentNode.removeChild(param.dom);
        }
    },
    /**
     * 锁定物体
     * @param {number} param.value 物体id
     */
    lock: function(param) {
        if (param.value == config.geometry.selected) selectGeometry(-1);
        stage.meshLock(param.value, true);
    },
    /**
     * 解锁物体
     * @param {number} param.value 物体id
     */
    unlock: function(param) {
        stage.meshLock(param.value, false);
    },
    /**
     * 隐藏物体
     * @param {number} param.value 物体id
     */
    hide: function(param) {
        if (param.value == config.geometry.selected) selectGeometry(-1);
        stage.meshVisible(param.value, false);
    },
    /**
     * 显示物体
     * @param {number} param.value 物体id
     */
    visible: function(param) {
        stage.meshVisible(param.value, true);
    }
};


/**
 * 网格控制路由
 */
var grid_routing = {
/**
     * 设置主编辑器内网格颜色
     * @param {string} param.value css颜色字符串
     */
    color: function(param) {
        stage.setGridColor(param.value);
    },
    /**
     * 显示主编辑器里的网格
     */
    visible: function() {
        stage.callFunc('toggleAxis');
    },
    /**
     * 显示主编辑器里的网格，上一个方法的同名方法
     */
    show: function() {
        stage.callFunc('toggleAxis');
        ui.gridVisible();
    },
    /**
     * 隐藏主编辑器里的网格
     */
    hidden: function() {
        stage.callFunc('toggleAxis');
        ui.gridVisible();
    },
    /**
     * 放大主编辑器里的网格
     */
    big: function() {
        stage.callFunc('resizeGrid', 1);
    },
    /**
     * 缩小主编辑器里的网格
     */
    small: function() {
        stage.callFunc('resizeGrid', 0);
    }
};


/**
 * 摄像机控制路由
 */
var camera_routing = {
    /**
     * 设置摄像机焦距
     * @param {number} param.value 焦距具体值
     */
    r: function(param) {
        stage.zoomTo(param.value);
    },
    /**
     * 减少摄像机焦距，起到推进效果
     */
    zoomin: function() {
        stage.callFunc('zoomCamara', 1);
    },
    /**
     * 增加摄像机焦距，起到拉远效果
     */
    zoomout: function() {
        stage.callFunc('zoomCamara', 0);
    }
};


/**
 * 变换器控制路由
 */
var transformer_routing = {
    /**
     * 设置变换器工作状态为平移
     */
    translate: function() {
        transformer.setMode('translate');
    },
    /**
     * 设置变换器工作状态为旋转
     */
    rotate: function() {
        if (config.view != '3d') {
            alert('TODO ^_^');
            return;
        }
        transformer.setMode('rotate');
    },
    /**
     * 设置变换器工作状态为缩放
     */
    scale: function() {
        if (config.view != '3d') {
            alert('TODO ^_^');
            return;
        }
        transformer.setMode('scale');
    },
    /**
     * 放大变换器的控制单元
     */
    enlarge: function() {
        transformer.setSize(1);
    },
    /**
     * 缩小变换器的控制单元
     */
    narrow: function() {
        transformer.setSize(-1);
    },
    /**
     * 设置变换器工作在世界坐标模式下
     */
    world: function() {
        if (config.view != '3d') {
            alert('TODO ^_^');
            return true;
        }
        transformer.setSpace('world');
    },
    /**
     * 设置变换器工作在本地坐标模式下
     */
    local: function() {
        if (config.view != '3d') {
            alert('TODO ^_^');
            return true;
        }
        transformer.setSpace('local');
    }
};


/**
 * 全局控制路由
 */
var routing = {
    /**
     * 一级路由分发接口
     * @param {Object} param 命令集
     * @oaram {string} param.cmd 命令标识符
     */
    interface: function(param) {
        var cmd = param.cmd.split('_');
        if (
            cmd.length > 1
            && this[cmd[0]]
            && typeof this[cmd[0]][cmd[1]] == 'function'
        ) {
            this[cmd[0]][cmd[1]](param);
        } else if (typeof this[param.cmd] == 'function') {
            this[param.cmd](param);
        }
    },
    /**
     * 灯光控制二级路由器
     */
    light: light_routing,
    /**
     * 物体控制二级路由器
     */
    mesh: mesh_routing,
    /**
     * 网格控制二级路由器
     */
    grid: grid_routing,
    /**
     * 摄像机控制二级路由器
     */
    camera: camera_routing,
    /**
     * 变换器控制二级路由器
     */
    transformer: transformer_routing,
    /**
     * 设置主编辑器背景颜色
     * @param {string} param.value css颜色字符串
     */
    renderer_color: function(param) {
        stage.setRendererColor(param.value);
    }
};