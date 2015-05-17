/**
 * 3D舞台
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http:// lbxx1984.github.io/
 */
(function($) {


/**
 * 3D舞台插件
 * @param {Object} 配置参数
 * @param {number} param.cameraRadius 摄像机到期观察点的距离，可以理解为焦距
 * @param {number} param.cameraAngleA 摄像机视线与XOZ平面夹角
 * @param {number} param.cameraAngleB 摄像机视线在XOZ平面投影与X轴夹角
 * @param {Object} param.cameraLookAt 摄像机的观察点，3D坐标
 * @param {number} param.width 舞台宽度
 * @param {number} param.height 舞台高度
 * @param {string} param.clearColor 编辑器背景颜色
 * @param {boolean} param.showGrid 是否显示网格
 * @param {string} param.gridColor 网格的颜色
 */
$.fn.Stage3D = function(param) {


    /***内部参数***/
    // 本组件
    var _this = this;
    // 3D物体hash表
    var _children = {};
    // 摄像机参数
    var _cameraRadius = param.cameraRadius || 2000;
    var _cameraAngleA = param.cameraAngleA || 40;
    var _cameraAngleB = param.cameraAngleB || 45;
    var _cameraLookAt = param.cameraLookAt || {x: 0, y: 0, z: 0};
    var _cameraMoveSpeed = 2;
    // 舞台参数
    var _display = true;
    var _width = param.width || 1000;
    var _height = param.height || 800;
    var _clearColor = (param.clearColor == null) ? 0xffffff : param.clearColor;
    // 网格和坐标轴参数
    var _showGrid = (param.showGrid == null) ? false : true;
    var _gridColor = (param.gridColor == null) ? 0xffffff : param.gridColor;
    var _gridSize = 2000;
    var _gridStep = 100;
    var _gridLocked = true;
    // 鼠标参数
    var _mouse2d = new THREE.Vector3();
    var _mouse3d = new THREE.Vector3();
    // 需要传递animate动作的插件
    var _plugin = {}
    // 自定义事件
    var _event = {};
    // 3D摄像机
    var _camera = new THREE.PerspectiveCamera(60, _width / _height, 1, 20000);
    // 3D场景
    var _scene = new THREE.Scene();
    // WebGL渲染器
    var _renderer = new THREE.WebGLRenderer({antialias: true});
    // 射线，用于鼠标拾取物体
    var _raycaster = new THREE.Raycaster();
    // 网格的容器，主要作用是接受对网格的操作，之前几个版本引擎网格有问题
    var _bg = new THREE.Object3D();
    // 网格
    var _grid = new THREE.GridHelper(_gridSize, _gridStep);
    // 坐标轴
    var _axis = new THREE.AxisHelper(200);
    // 让鼠标获取空间坐标的透明坐标纸
    var _plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10000, 10000, 1, 1),
        new THREE.MeshLambertMaterial({
            ambient: 0xffffff,
            side: THREE.DoubleSide
        })
    );


    /***初始化3D场景***/
    if (_showGrid) {
        _scene.add(_grid);
        _scene.add(_axis);
    }
    _scene.add(_bg);
    _bg.add(_plane);
    _grid.setColors(_gridColor, _gridColor);
    _renderer.setClearColor(_clearColor);
    _renderer.setSize(_width, _height);
    _plane.rotation.x = Math.PI * 0.5;
    _plane.visible = false;
    _this[0].appendChild(_renderer.domElement);
    setCameraPosition();
    animate();


    /***内部处理事件***/
    _this.bind("mousemove", function(e) {
        // 计算当前鼠标对应的3D空间坐标，并拾取鼠标下的物体
        var offset = _this.offset();
        var x = ((e.clientX - offset.left) / _width);
        var y = ((e.clientY - offset.top + document.body.scrollTop) / _height)
        _mouse2d.x = x * 2 - 1;
        _mouse2d.y = -y * 2 + 1;
        _mouse2d.z = 0.5;
        _mouse2d.unproject(_camera);
        _raycaster.ray.set(
            _camera.position, 
            _mouse2d.sub(_camera.position).normalize()
        );
        var intersects = _raycaster.intersectObjects([_plane]);
        var intersector = null;
        var voxelPosition = new THREE.Vector3();
        var tmpVec = new THREE.Vector3();
        var normalMatrix = new THREE.Matrix3();
        if (intersects.length > 0) {
            intersector = intersects[0];
            normalMatrix.getNormalMatrix(intersector.object.matrixWorld);
            tmpVec.applyMatrix3(normalMatrix).normalize();
            voxelPosition.addVectors(intersector.point, tmpVec);
            if (Math.abs(voxelPosition.x) < 5) {
                voxelPosition.x = 0;
            }
            if (Math.abs(voxelPosition.y) < 5) {
                voxelPosition.y = 0;
            }
            if (Math.abs(voxelPosition.z) < 5) {
                voxelPosition.z = 0;
            }
            _mouse3d = voxelPosition.clone();
        }
    });
    _this[0].onmousewheel = function(event) {
        cameraZoom(event.wheelDelta);
        outputCamera();
        event.stopPropagation();
        return false;
    };


    /***辅助函数***/
    /**
     * 场景渲染，3D心跳函数，负责渲染当前场景，并将心跳传递给各个插件
     */
    function animate() {
        requestAnimationFrame(animate);
        if (!_display) return;
        // 渲染内部
        _camera.lookAt(_cameraLookAt);
        _renderer.render(_scene, _camera);
        // 渲染插件
        for (var key in _plugin) _plugin[key].animate();
    }
    /**
     * 设置摄像机焦距
     * @param {number} value 焦距
     */
    function cameraZoom(value) {
        _cameraRadius += -0.2 * _cameraRadius * value * _cameraMoveSpeed / _width;
        if (_cameraRadius < 50) {
            _cameraRadius = 50;
        }
        if (_cameraRadius > 5000) {
            _cameraRadius = 5000;
        }
        setCameraPosition();
    }
    /**
     * 设置摄像机位置
     *     根据AngleA、AngleB、Radius、lookAt等信息换算出Camera的position
     */
    function setCameraPosition() {
        var y = _cameraRadius * Math.sin(Math.PI * _cameraAngleA / 180);
        var x = _cameraRadius * Math.cos(Math.PI * _cameraAngleA / 180) 
                * Math.cos(Math.PI * _cameraAngleB / 180);
        var z = _cameraRadius * Math.cos(Math.PI * _cameraAngleA / 180) 
                * Math.sin(Math.PI * _cameraAngleB / 180);
        if (Math.abs(_cameraAngleA) < 5) {
            _bg.rotation.z = _grid.rotation.z
                 = Math.PI * 0.5 - Math.PI * _cameraAngleB / 180;
            _bg.rotation.x = _grid.rotation.x
                = Math.PI * 1.5;
            _gridLocked = false;
        } else {
            _bg.rotation.z = _grid.rotation.z = 0;
            _bg.rotation.x = _grid.rotation.x = 0;
            _gridLocked = true;
        }
        _camera.position.set(
            x + _cameraLookAt.x,
            y + _cameraLookAt.y,
            z + _cameraLookAt.z
        );
    }
    /**
     * 向外部派发onCameraChange事件，并输出摄像机配置信息
     */
    function outputCamera() {
        if (!_event["onCameraChange"]) return;
        _event["onCameraChange"](
            _camera.position,
            _cameraLookAt,
            {
                r: 5000 - _cameraRadius,
                b: 5000,
                a: 50
            }
        );
    }


    /***外部接口***/
    /**
     * 获取舞台中物体hash表
     * @return {Object} 存放物体的hash表，key的id
     */
    _this.children = function() {
        return _children;
    }
    /**
     * 根据id获取3D物体对象
     * @param {number} key 物体id
     * @return {Object} 3D物体对象
     */
    _this.getChild = function(key) {
        return _children[key];
    }
    /**
     * 获取3D场景
     * @return {Object} 3D场景对象
     */
    _this.getScene = function() {
        return _scene;
    }
    /**
     * 获取摄像机
     * @return {Object} 摄像机对象
     */
    _this.getCamera = function() {
        return _camera;
    }
    /**
     * 获取渲染器
     * @return {Object} 渲染器
     */
    _this.getRenderer = function() {
        return _renderer;
    }
    /**
     * 获取3D鼠标位置
     * @return {Object} 3D鼠标对象
     */
    _this.getMousePosition = function() {
        return _mouse3d.clone();
    }
    /**
     * 根据关键字获取插件
     * @param {string} key 插件关键字
     * @return 插件对象
     */
    _this.getPlugin = function(key) {
        return _plugin[key];
    }
    /**
     * 获取网格锁定状态，当网格与XOZ平行时，认为其被锁定
     * @param {boolean} 网格锁定状态
     */
    _this.isGridLocked = function() {
        return _gridLocked;
    }
    /**
     * 向舞台中添加物体
     * @param {Object} geo 3D物体对象
     */
    _this.addGeometry = function(geo) {
        if (_children[geo.tid]) return false;
        _children[geo.tid] = geo;
        _scene.add(geo);
    }
    /**
     * 从舞台中删除物体
     * @param {Object} geo 3D物体对象
     */
    _this.removeGeometry = function(geo) {
        _scene.remove(geo);
        delete _children[geo.tid];
    }
    /**
     * 获取鼠标下的物体
     * @param {Array} arr 物体数组，如果指定就从数组中查找，不指定从全局查找
     * @param {Object} e 鼠标事件对象
     * @return {Object} 3D物体对象 或null
     */
    _this.selectGeometry = function(arr,e) {
        var array = [];
        if (arr instanceof Array) {
            array = arr;
        } else {
            for (var key in _children) {
                if (_children[key].visible) array.push(_children[key]);
            }
        }
        if (array.length == 0) return null;
        var offset = _this.offset();
        var x = ((e.clientX - offset.left) / _width);
        var y = ((e.clientY - offset.top + document.body.scrollTop) / _height)
        _mouse2d.x = x * 2 - 1;
        _mouse2d.y = -y * 2 + 1;
        _mouse2d.z = 0.5;
        _mouse2d.unproject(_camera);
        _raycaster.ray.set(
            _camera.position, 
            _mouse2d.sub(_camera.position).normalize()
        );
        var intersects = _raycaster.intersectObjects(array);
        if (intersects.length > 0) {
            return intersects[0].object;
        } else {
            return null;
        }
    }
    /**
     * 设置摄像机位置
     * @param {Object} p 摄像机位置配置
     * @param {number} p.a 对应cameraAngleA
     * @param {number} p.b 对应cameraAngleB
     */
    _this.setCamera = function(p) {
        if (p == null) {
            return;
        }
        if (p.a != null) {
            _cameraAngleA = p.a;
        }
        if (p.b != null) {
            _cameraAngleB = p.b;
        }
        setCameraPosition();
        outputCamera();
    }
    /**
     * 改变摄像机焦距
     * @param {number} dx 变化方向，大于0表示拉近，其值不参与计算
     */
    _this.zoomCamara = function(dx) {
        if (dx > 0) {
            cameraZoom(360);
        } else {
            cameraZoom(-360);
        }
        outputCamera();
    }
    /**
     * 设置摄像机焦距
     * @param {number} v 焦距，对应cameraRadius，取值范围[50,5000]
     */
    _this.zoomTo = function(v) {
        _cameraRadius = 5000 - v;
        if (_cameraRadius < 50) {
            _cameraRadius = 50;
        }
        if (_cameraRadius > 5000) {
            _cameraRadius = 5000;
        }
        setCameraPosition();
        outputCamera();
    }
    /**
     * 设置摄像机观察点，相当于平移摄像机
     * @param {number} dx 横向移动增量
     * @param {number} dy 纵向移动增量
     */
    _this.cameraLookAt = function(dx, dy) {
        dx = _cameraRadius * dx * _cameraMoveSpeed * 0.2 / _width;
        dy = _cameraRadius * dy * _cameraMoveSpeed * 0.2 / _height;
        if (Math.abs(_cameraAngleA) > 5) {
            _cameraLookAt.x -= Math.sin(Math.PI * _cameraAngleB / 180) * dx;
            _cameraLookAt.z += Math.cos(Math.PI * _cameraAngleB / 180) * dx;
            _cameraLookAt.x -= Math.cos(Math.PI * _cameraAngleB / 180) * dy 
                * Math.abs(_camera.position.y) / _camera.position.y;
            _cameraLookAt.z -= Math.sin(Math.PI * _cameraAngleB / 180) * dy 
                * Math.abs(_camera.position.y) / _camera.position.y;
        } else {
            _cameraLookAt.x -= Math.sin(Math.PI * _cameraAngleB / 180) * dx;
            _cameraLookAt.z += Math.cos(Math.PI * _cameraAngleB / 180) * dx;
            _cameraLookAt.y += dy;
        }
        _bg.position.x = _cameraLookAt.x;
        _bg.position.y = _cameraLookAt.y;
        _bg.position.z = _cameraLookAt.z;
        setCameraPosition();
        outputCamera();
    }
    /**
     * 设置编辑器背景色
     * @param {string} c CSS形式颜色，如红色：#FF0000
     */
    _this.setRendererColor = function(c) {
        _renderer.setClearColor(parseInt(c.substr(1), 16));
    }
    /**
     * 切换坐标轴和网格的显示隐藏状态
     */
    _this.toggleAxis = function() {
        _showGrid = !_showGrid;
        _grid.visible = _showGrid;
        _axis.visible = _showGrid;
    }
    /**
     * 设置网格颜色
     * @param {string} e CSS颜色
     */
    _this.setGridColor = function(e) {
        _gridColor = parseInt(e.substr(1), 16);
        _grid.setColors(_gridColor, _gridColor);
    }
    /**
     * 改变网格大小
     * @param {number} enlarge 放大缩小标识，1表示放大，其他都是缩小 
     */
    _this.resizeGrid = function(enlarge) {
        if (enlarge == 1) {
            _gridSize = Math.min(_gridSize + 1000, 20000);
        } else {
            _gridSize = Math.max(_gridSize - 1000, 1000);
        }
        _scene.remove(_grid);
        _grid = new THREE.GridHelper(_gridSize, _gridStep);
        _grid.setColors(_gridColor, _gridColor);
        if (_showGrid) {
            _scene.add(_grid);
        }
    }
    /**
     * 修改编辑器大小
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    _this.resize = function(width, height) {
        _width = width;
        _height = height;
        _camera.aspect = width / height;
        _camera.updateProjectionMatrix();
        _renderer.setSize(width, height);
    }
    /**
     * 设置编辑器显示隐藏标志
     * @param {boolean} b 是否显示
     */
    _this.display = function(b) {
        _display = b;
    }
    /**
     * 为编辑器挂载外部插件
     * @param {string} key 插件名称
     * @param {Object} obj 插件对象
     */
    _this.addPlugin = function(key, obj) {
        _plugin[key] = obj;
    }
    /**
     * 删除插件
     * @param {string} key 插件名称
     */
    _this.removePlugin = function(key) {
        delete _plugin[key];
    }
    /**
     * 为舞台系统绑定事件
     * @param {string} type 事件类型
     * @param {function} func 事件处理句柄
     */
    _this.addListener = function(type, func) {
        _event[type] = func;
    }
    /**
     * 解绑舞台系统事件
     * @param {string} type 事件类型
     * @param {function} func 事件处理句柄
     */
    _this.removeListener = function(type) {
        _event[type] = null;
    }
    return _this;
}
})(jQuery);