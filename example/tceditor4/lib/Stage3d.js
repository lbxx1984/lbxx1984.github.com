(function($) {

$.fn.Stage3D = function(param) {

	//组件和3D物体
	var _this = this;
	var _children = {};
	//摄像机参数
	var _cameraRadius = param.cameraRadius || 2000;
	var _cameraAngleA = param.cameraAngleA || 40;
	var _cameraAngleB = param.cameraAngleB || 45;
	var _cameraLookAt = param.cameraLookAt || {x: 0, y: 0, z: 0};
	var _cameraMoveSpeed = 2;
	//舞台参数
	var _display = true;
	var _width = param.width || 1000;
	var _height = param.height || 800;
	var _clearColor = (param.clearColor == null) ? 0xffffff : param.clearColor;
	//网格和坐标轴参数
	var _showGrid = (param.showGrid == null) ? false : true;
	var _gridColor = (param.gridColor == null) ? 0xffffff : param.gridColor;
	var _gridSize = 2000;
	var _gridStep = 100;
	var _gridLocked = true;
	//鼠标参数
	var _mouse2d = new THREE.Vector3();
	var _mouse3d = new THREE.Vector3();
	//需要传递animate动作的插件
	var _plugin = {}
	//自定义事件
	var _event = {};


	//3D场景
	var _camera = new THREE.PerspectiveCamera(60, _width / _height, 1, 20000);
	var _scene = new THREE.Scene();
	var _renderer = new THREE.WebGLRenderer({antialias: true});
	var _raycaster = new THREE.Raycaster();
	var _bg = new THREE.Object3D();
	var _grid = new THREE.GridHelper(_gridSize, _gridStep);
	var _axis = new THREE.AxisHelper(200);
	var _plane = new THREE.Mesh(
		new THREE.PlaneGeometry(10000, 10000, 1, 1),
		new THREE.MeshLambertMaterial({
			ambient: 0xffffff,
			side: THREE.DoubleSide
		})
	);
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
	_this
		.bind("mousemove", function(e) {
			//return;
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
		})
	_this[0].onmousewheel = function(event) {
		cameraZoom(event.wheelDelta);
		outputCamera();
		event.stopPropagation();
		return false;
	};

	/***辅助函数***/
	//场景渲染
	function animate() {
		requestAnimationFrame(animate);
		if (!_display) {
			return;
		}
		//渲染内部
		_camera.lookAt(_cameraLookAt);
		_renderer.render(_scene, _camera);
		//渲染插件
		for (var key in _plugin) {
			_plugin[key].animate();
		}
	}

	//设置摄像机焦距
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

	//计算摄像机姿态
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

	//输出摄像机位置
	function outputCamera() {
		if (!_event["onCameraChange"]) return;
		_event["onCameraChange"](
			_camera.position, _cameraLookAt, {
				r: 5000 - _cameraRadius,
				b: 5000,
				a: 50
			}
		);
	}

	


	/***外部接口***/
	//////////////////舞台信息接口
	_this.children = function() {
		return _children;
	}
	_this.getChild = function(key) {
		return _children[key];
	}
	_this.getScene = function() {
		return _scene;
	}
	_this.getCamera = function() {
		return _camera;
	}
	_this.getRenderer = function() {
		return _renderer;
	}
	_this.getMousePosition = function() {
		return _mouse3d.clone();
	}
	_this.getPlugin = function(key) {
		return _plugin[key];
	}
	_this.isGridLocked = function() {
		return _gridLocked;
	}
	//////////////////物体接口
	_this.addGeometry = function(geo) {
		if (_children[geo.tid]) return false;
		_children[geo.tid] = geo;
		_scene.add(geo);
	}
	_this.removeGeometry = function(geo) {
		_scene.remove(geo);
		delete _children[geo.tid];
	}
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
	///////////////////摄像机接口
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
	_this.zoomCamara = function(dx) {
		if (dx > 0) {
			cameraZoom(360);
		} else {
			cameraZoom(-360);
		}
		outputCamera();
	}
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
	_this.setRendererColor = function(c) {
		_renderer.setClearColor(parseInt(c.substr(1), 16));
	}
	_this.toggleAxis = function() {
		_showGrid = !_showGrid;
		_grid.visible = _showGrid;
		_axis.visible = _showGrid;
	}
	_this.setGridColor = function(e) {
		_gridColor = parseInt(e.substr(1), 16);
		_grid.setColors(_gridColor, _gridColor);
	}
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
	_this.resize = function(width, height) {
		_width = width;
		_height = height;
		_camera.aspect = width / height;
		_camera.updateProjectionMatrix();
		_renderer.setSize(width, height);
	}
	_this.display = function(b) {
		_display = b;
	}
	//事件接口
	_this.addPlugin = function(key, obj) {
		_plugin[key] = obj;
	}
	_this.removePlugin = function(key) {
		delete _plugin[key];
	}
	_this.addListener = function(type, func) {
		_event[type] = func;
	}
	_this.removeListener = function(type) {
		_event[type] = null;
	}
	return _this;
}
})(jQuery);