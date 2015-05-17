/**
 * 摄像机控制器
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
(function($) {
    
/**
 * 控制器插件
 * @param {Object} 配置参数
 * @param {number} param.cameraAngleA 摄像机观察线与XOZ平面夹角
 * @param {numner} param.cameraAngleB 摄像机观察线XOZ平面投影，与X轴夹角
 * @param {boolean} param.animate 控制器在切换角度时是否使用动画效果
 * @param {number} param.width 控制器整体宽度
 * @param {numner} param.height 控制器整体高度
 * @param {string} param.language 编辑器的语言种类，涉及到纹理路径
 */
$.fn.CameraController = function(param) {
    
    var _this = this;
    var _INTERSECTED = null;
    var _stage = [];
    var _cameraRadius = 90;
    var _cameraAngleA = param.cameraAngleA || 40;
    var _cameraAngleB = param.cameraAngleB || 45;
    var _cameraMoveSpeed = 2;
    var _cameraRotated = false;
    var _cameraLookAt = {x: 0, y: 0, z: 0};
    var _tmpMouse = [0, 0];
    var _animate = (param.animate == null) ? false : param.animate;
    var _camera = new THREE.PerspectiveCamera(60, param.width / param.height, 1, 10000);
    var _scene = new THREE.Scene();
    var _renderer = new THREE.CanvasRenderer();
    var _projector = new THREE.Projector();
    var _raycaster = new THREE.Raycaster();
    var info = {
        'font':[20, 0, 0, 0, 0.5, 0, 30, 30, 0],
        'back': [-20, 0, 0, 0, -0.5, 0, 30, 30, 0],
        'top': [0, 20, 0, -0.5, 0, 0, 30, 30, 0],
        'bottom': [0, -20, 0, 0.5, 0, 0, 30, 30, 0],
        'left': [0, 0, 20, 0, 0, 0, 30, 30, 0],
        'right': [0, 0, -20, 0, -1, 0, 30, 30, 0],
        'font_left_top': [17.5, 17.5, 17.5, 0, 0, 0, 5, 5, 5],
        'font_right_top': [17.5, 17.5, -17.5, 0, 0, 0, 5, 5, 5],
        'left_top_back': [-17.5, 17.5, 17.5, 0, 0, 0, 5, 5, 5],
        'back_top_right': [-17.5, 17.5, -17.5, 0, 0, 0, 5, 5, 5],
        'left_font_bottom': [17.5, -17.5, 17.5, 0, 0, 0, 5, 5, 5],
        'font_right_bottom': [17.5, -17.5, -17.5, 0, 0, 0, 5, 5, 5],
        'left_back_bottom': [-17.5, -17.5, 17.5, 0, 0, 0, 5, 5, 5],
        'right_back_bottom': [-17.5, -17.5, -17.5, 0, 0, 0, 5, 5, 5],
        'left_top': [0, 17.5, 17.5, 0, 0, 0, 30, 5, 5],
        'left_bottom': [0, -17.5, 17.5, 0, 0, 0, 30, 5, 5],
        'top_right': [0, 17.5, -17.5, 0, 0, 0, 30, 5, 5],
        'bottom_right': [0, -17.5, -17.5, 0, 0, 0, 30, 5, 5],
        'top_font': [17.5, 17.5, 0, 0, 0, 0, 5, 5, 30],
        'bottom_font': [17.5, -17.5, 0, 0, 0, 0, 5, 5, 30],
        'back_bottom': [-17.5, -17.5, 0, 0, 0, 0, 5, 5, 30],
        'top_back': [-17.5, 17.5, 0, 0, 0, 0, 5, 5, 30],
        'font_left': [17.5, 0, 17.5, 0, 0, 0, 5, 30, 5],
        'font_right': [17.5, 0, -17.5, 0, 0, 0, 5, 30, 5],
        'back_right': [-17.5, 0, -17.5, 0, 0, 0, 5, 30, 5],
        'back_left': [-17.5, 0, 17.5, 0, 0, 0, 5, 30, 5]
    };
    var cmd = {
        'font_left_top': [45, 45],
        'left_top_back': [45, 135],
        'back_top_right': [45, 225],
        'font_right_top': [45, 315],
        'left_font_bottom': [-45, 45],
        'left_back_bottom': [-45, 135],
        'right_back_bottom': [-45, 225],
        'font_right_bottom': [-45, 315],
        'left_top': [45, 90],
        'left_bottom': [-45, 90],
        'top_right': [45, 270],
        'bottom_right': [-45, 270],
        'top_font': [45, 0],
        'bottom_font': [-45, 0],
        'top_back': [45, 180],
        'back_bottom': [-45, 180],
        'font_left': [0, 45],
        'font_right': [0, 315],
        'back_right': [0, 225],
        'back_left': [0, 135],
        'left': [0, 90],
        'right': [0, 270],
        'font': [0, 0],
        'back': [0, 180],
        'top': [89, null],
        'bottom': [-89, null]
    };

    /**创建控制面*/
    for (var key in info) {
        var mesh = null;
        if (key.indexOf('_') < 0) {
            mesh = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(info[key][6], info[key][7]),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'textures/' + key + '_' + param.language + '.png'
                    )
                })
            );
        } else {
            mesh = new THREE.Mesh(
                new THREE.BoxGeometry(info[key][6], info[key][7], info[key][8]),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture('textures/background.png')
                })
            );
        }
        mesh.position.x = info[key][0];
        mesh.position.y = info[key][1];
        mesh.position.z = info[key][2];
        mesh.rotation.x = Math.PI * info[key][3];
        mesh.rotation.y = Math.PI * info[key][4];
        mesh.rotation.z = Math.PI * info[key][5];
        mesh.tid = key;
        _scene.add(mesh);
    }

    /**注册事件*/
    _this
        .bind('mouseleave', function () {
            if (_INTERSECTED) _INTERSECTED.material.opacity = 1;
            _INTERSECTED = null;
        })
        .bind('mousedown', function (e) {
            _tmpMouse[0] = e.clientX;
            _tmpMouse[1] = e.clientY;
            $(window)
                .bind('mousemove', freeRotateCamera)
                .bind('mouseup', unbindMouseMove)
        })
        .bind('mousemove', function (e) {
            var pos = _this.position();
            var vector = new THREE.Vector3(
                ((e.clientX - pos.left) / param.width) * 2 - 1, 
                -((e.clientY - pos.top) / param.height) * 2 + 1,
                1
            );
            vector.unproject(_camera);
            _raycaster.ray.set(_camera.position, vector.sub(_camera.position).normalize());
            var intersects = _raycaster.intersectObjects(_scene.children);
            if (intersects.length > 0) {
                if (_INTERSECTED != intersects[0].object) {
                    if (_INTERSECTED) _INTERSECTED.material.opacity = 1;
                    _INTERSECTED = intersects[0].object;
                    _INTERSECTED.material.opacity = 0.2
                }
            } else {
                if (_INTERSECTED) _INTERSECTED.material.opacity = 1;
                _INTERSECTED = null;
            }

        })
        .bind('mouseup', function () {
            $(window).unbind('mousemove', freeRotateCamera);
            if (_cameraRotated) {
                _cameraRotated = false;
                return;
            }
            if (!_INTERSECTED) return;
            var c = cmd[_INTERSECTED.tid];
            if (c[0] != null) cameraAngleTo(c[0], 'A');
            if (c[1] != null) cameraAngleTo(c[1], 'B');
        });
    _this[0].onmousewheel = function () {
        return false;
    }

    /**初始化舞台*/
    _this[0].appendChild(_renderer.domElement);
    _scene.add(new THREE.AmbientLight(0xffffff));
    _renderer.setClearColor(0xff0000, 0);
    _renderer.setSize(param.width, param.height);
    setCameraPosition();


    /**以下是内部方法*/
    /**
     * 设置摄像机的角度A
     * @param {number} dx 角度A要变动到的值
     */
    function toA(dx) {
        if (dx == 0) return;
        var dy = _cameraMoveSpeed * dx * 90 / Math.PI / $(window).height();
        if (_cameraAngleA < 90 && _cameraAngleA + dy > 90) dy = 0;
        if (_cameraAngleA > -90 && _cameraAngleA + dy < -90) dy = 0;
        _cameraAngleA = _cameraAngleA + dy;
    }
    /**
     * 设置摄像机的角度B
     * @param {number} dx 角度B要变动到的值
     */
    function toB(dx) {
        if (dx == 0) return;
        _cameraAngleB += _cameraMoveSpeed * dx * 90 / Math.PI / $(window).width();
        if (_cameraAngleB > 360) _cameraAngleB -= 360;
        if (_cameraAngleB < 0)  _cameraAngleB += 360;
    }
    /**
     * 通过拖动自由旋转控制模仿
     * @param {Object} e 鼠标事件对象
     */
    function freeRotateCamera(e) {
        var dx = e.clientY - _tmpMouse[1];
        var dy = e.clientX - _tmpMouse[0];
        if (dx == 0 && dy == 0) return;
        toA(e.clientY - _tmpMouse[1]);
        toB(e.clientX - _tmpMouse[0]);
        _tmpMouse = [e.clientX, e.clientY];
        _cameraRotated = true;
        setCameraPosition();
        updateStage();
    }
    /**
     * 鼠标抬起后解绑鼠标移动事件句柄
     */
    function unbindMouseMove() {
        _cameraRotated = false;
        $(window).unbind('mousemove', freeRotateCamera);
    }
    /**
     * 根据摄像机的体态参数换算摄像机位置
     */
    function setCameraPosition() {
        var y = _cameraRadius * Math.sin(Math.PI * _cameraAngleA / 180);
        var x = _cameraRadius * Math.cos(Math.PI * _cameraAngleA / 180)
            * Math.cos(Math.PI * _cameraAngleB / 180);
        var z = _cameraRadius * Math.cos(Math.PI * _cameraAngleA / 180)
            * Math.sin(Math.PI * _cameraAngleB / 180);
        _camera.position.set(x, y, z);
    }
    /**
     * 更新绑定到控制器的所有舞台中的摄像机
     */
    function updateStage() {
        if (_stage.length == 0) return;
        for (var n = 0; n < _stage.length; n++) {
            _stage[n].setCamera({
                a: _cameraAngleA,
                b: _cameraAngleB
            });
        }
    }
    /**
     * 更改摄像机的控制参数，可以一次性，也可以动画
     * @param {number} to 要设置的值
     * @oaram {string} type 具体参数，A或B，对应角度参数A和B
     */
    function cameraAngleTo(to, type) {
        if (!_animate) {
            if (type == 'A') {
                _cameraAngleA = to;
            } else {
                _cameraAngleB = to;
            }
            setCameraPosition();
            updateStage();
            return;
        }
        if (type == 'A') {
            var old = _cameraAngleA;
            var step = Math.abs(old - to) / 10;
            if (step < 1) {
                _cameraAngleA = to;
                setCameraPosition();
                updateStage();
                return;
            }
            if (old > to) {
                _cameraAngleA -= step;
            } else {
                _cameraAngleA += step;
            }
            setCameraPosition();
            updateStage();
            setTimeout(function () {
                cameraAngleTo(to, type)
            }, 2);
        }
        if (type == 'B') {
            var old = _cameraAngleB;
            var step = Math.abs(old - to) / 10;
            if (step < 1) {
                _cameraAngleB = to;
                setCameraPosition();
                updateStage();
                return;
            }
            if (old > to) {
                _cameraAngleB -= step;
            } else {
                _cameraAngleB += step;
            }
            setCameraPosition();
            updateStage();
            setTimeout(function () {
                cameraAngleTo(to, type);
            }, 2);
        }
    }
    
    
    /**以下是外部接口*/
    /**
     * 主渲染方法，本控制器的渲染动作由外部心跳方法触发，不自行渲染
     */
    _this.animate = function () {
        _camera.lookAt(_cameraLookAt);
        _renderer.render(_scene, _camera);
    }
    /**
     * 添加控制的3D舞台
     * @param {Object} stage stage3D舞台对象
     */
    _this.addStage = function(stage) {
        _stage.push(stage);
    }
    /**
     * 输出控制器变更标志
     * @return {boolean} 控制器是否发生了变化
     */
    _this.cameraRotated = function () {
        return _cameraRotated;
    }
    /**
     * 设置本控制器的角度参数
     * @param {Object} obj控制参数对象
     * @param {number} obj.a 控制角度A
     * @param {number} obj.b 控制角度B
     */
    _this.cameraAngleTo = function(obj) {
        if (obj.a != null) cameraAngleTo(obj.a, 'A');
        if (obj.b != null) cameraAngleTo(obj.b, 'B');
    }
    return _this;
}
})(jQuery);
