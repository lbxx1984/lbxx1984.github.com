// JavaScript Document
(function($) {

$.fn.Stage2D = function(param) {


	/***内部参数***/
	//组件参数
	var _this = this;
	var _children = null; //stage3d里的children
	var _meshes = {}; //存放封装好的2D物体		
	//舞台参数
	var _width = param.width;
	var _height = param.height;
	var _showGrid = (param.showGrid == null) ? false : true;
	var _gridColor = (param.gridColor == null) ? "#ffffff" : param.gridColor;
	var _meshColor = (param.meshColor == null) ? "#F0F0F0" : param.meshColor;
	var _meshSelectColor = (param.meshSelectColor == null) 
							? "#D97915" : param.meshSelectColor;
	var _meshHoverColor = (param.meshHoverColor == null) 
							? "yellow" : param.meshHoverColor;
	//绘制辅助信息
	var _type = "xoz";
	var _scale = parseInt(param.scale) || 3;
	var _offset = {x: 0, y: 0};
	var _cellSize = 50;
	//鼠标参数
	var _mouse = new THREE.Vector3();
	//绘图容器
	var _gridCanvas = document.createElement("canvas");
	var _meshCanvas = document.createElement("canvas");
	var _helperContainer = document.createElement("div");
	//绘图画板
	var _gridCTX = null;
	var _meshCTX = null;
	var _helperCTX = null;
	//物体参数
	var _meshSelected = null;
	//自定义事件
	var _event = {};


	/***初始化2D场景***/
	_gridCanvas.width = _width;
	_gridCanvas.height = _height;
	_meshCanvas.width = _width;
	_meshCanvas.height = _height;
	_gridCanvas.style.cssText = "position:absolute;top:0px;left:0px;";
	_meshCanvas.style.cssText = "position:absolute;top:0px;left:0px;";
	_helperContainer.style.cssText = "position:absolute;top:0px;left:0px;"
		+ "width:" + _width + "px;height:" + _height + "px;" 

	_gridCTX = _gridCanvas.getContext("2d");
	_meshCTX = _meshCanvas.getContext("2d");
	_helperCTX = Raphael(_helperContainer, _width, _height);

	this[0].appendChild(_gridCanvas);
	this[0].appendChild(_meshCanvas);
	this[0].appendChild(_helperContainer);
	
	drawGrid(_gridCTX);



	/***内部处理事件***/
	_this
		.bind("mousemove", function(e) {
			var pos = _this.offset();
			var x = (e.clientX - pos.left - _width * 0.5) 
					* _scale - _offset.x;
			var y = (_height * 0.5 - e.clientY + pos.top 
					- document.body.scrollTop) * _scale - _offset.y;
			var mouse3d = new THREE.Vector3();
			if (_type == "xoz") {
				mouse3d.x = x;
				mouse3d.z = y;
			} else if (_type == "xoy") {
				mouse3d.x = x;
				mouse3d.y = y;
			} else if (_type == "yoz") {
				mouse3d.y = x;
				mouse3d.z = y;
			}
			_mouse = mouse3d.clone();
		});
	_this[0].onmousewheel = function(event) {
		_this.zoomCamara(event.wheelDelta>0)
		outputCamera();
		event.stopPropagation();
		return false;
	};



	/***辅助函数***/
	//生成物体信息
	function render(ctx) {
		_meshes = [];
		for (var key in _children) {
			if (!_children[key].visible) continue;
			_meshes[key] = new Mesh2D({
				geo: _children[key],
				type: _type,
				width: _width,
				height: _height,
				offset: _offset,
				scale: _scale,
				meshColor: _meshColor
			});
		}
		drawMeshes(ctx);
	}

	//绘制物体
	function drawMeshes(ctx, mx, my) {
		var meshHover = null;
		ctx.clearRect(0, 0, _width, _height);
		for(var key in _meshes){
			if (!_meshes[key].visible) {
				continue;
			}
			_meshes[key].draw(_meshCTX);
			if (mx != null && my != null && _meshCTX.isPointInPath(mx, my)) {
				_meshCTX.fillStyle = _meshHoverColor;
				meshHover = key;
			} else if (key == _meshSelected) {
				_meshCTX.fillStyle = _meshSelectColor;
			} else {
				_meshCTX.fillStyle = _meshColor;
			}
			_meshCTX.fill();
		}
		return meshHover;
	}

	//绘制辅助网格
	function drawGrid(ctx) {
		var x0 = 0, y0 = 0, step, x, y, color1, color2;
		x0 = _offset.x / _scale + _width * 0.5;
		y0 = _height * 0.5 - _offset.y / _scale;
		step = _cellSize / _scale;
		//初始化颜色
		if (_type == "xoz") {
			color1 = "#ff0000"; color2 = "#4285F4";
		} else if (_type == "xoy") {
			color1 = "#ff0000"; color2 = "#3E9B1C";
		} else {
			color1 = "#3E9B1C"; color2 = "#4285F4";
		}
		//清空
		ctx.clearRect(0, 0, _width, _height);
		if (!_showGrid) return;
		//绘制表格
		ctx.beginPath();
		ctx.strokeStyle = _gridColor;
		ctx.lineWidth = 0.5;
		x = x0;
		while (x <= _width) {
			ctx.moveTo(x + 0.5, 0.5);
			ctx.lineTo(x + 0.5, _height + 0.5);
			x += step;
		}
		x = x0 - step;
		while (x >= 0) {
			ctx.moveTo(x + 0.5, 0.5);
			ctx.lineTo(x + 0.5, _height + 0.5);
			x -= step;
		}
		y = y0;
		while (y <= _height) {
			ctx.moveTo(0.5, y + 0.5);
			ctx.lineTo(_width + 0.5, y + 0.5);
			y += step;
		}
		y = y0 - step;
		while (y >= 0) {
			ctx.moveTo(0.5, y + 0.5);
			ctx.lineTo(_width + 0.5, y + 0.5);
			y -= step;
		}
		ctx.stroke();
		//绘制坐标轴
		ctx.beginPath();
		if (x0 > 0) {
			ctx.strokeStyle = color2;
			ctx.lineWidth = 2;
			ctx.moveTo(x0 + 0.5, 0.5);
			ctx.lineTo(x0 + 0.5, _height + 0.5);
		}
		ctx.stroke();
		ctx.beginPath();
		if (x0 > 0) {
			ctx.strokeStyle = color1;
			ctx.lineWidth = 2;
			ctx.moveTo(0.5, y0 + 0.5);
			ctx.lineTo(_width + 0.5, y0 + 0.5);
		}
		ctx.stroke();
	}

	//输出摄像机位置
	function outputCamera() {
		if (!_event["onCameraChange"]) return;
		var pos = {x: 9999, y: 9999, z: 9999};
		var lookAt = {x: 0, y: 0, z: 0};
		var r = {
			r: 100 * (1 - _scale / 5.5),
			b: 100,
			a: 0
		};
		if (_type == "xoz") {
			lookAt.x = pos.x = -_offset.x;
			lookAt.z = pos.z = -_offset.y;
		} else if (_type == "xoy") {
			lookAt.x = pos.x = -_offset.x;
			lookAt.y = pos.y = -_offset.y;
		} else if (_type == "yoz") {
			lookAt.y = pos.y = -_offset.x;
			lookAt.z = pos.z = -_offset.y;
		}
		_event["onCameraChange"](pos, lookAt, r);
	}

	//输出舞台刷新
	function outputFreshHandle() {
		if (!_event["onFresh"]) return;
		_event["onFresh"]();
	}


	/***外部接口***/
	//物体操作接口
	_this.meshVisible = function(id, value) {
		if (_meshes[id]) {
			_meshes[id].visible = value;
			drawMeshes(_meshCTX);
		}
	}
	_this.selectMeshByMouse = function (e) {
		var pos = _this.offset();
		var geo = drawMeshes(
			_meshCTX, 
			e.clientX - pos.left, 
			e.clientY - pos.top + document.body.scrollTop);
		if(geo != null){
			return _meshes[geo].geo;
		} else {
			return null;
		}

	}
	_this.meshClearSelected = function() {
		_meshSelected = null;
		drawMeshes(_meshCTX);
	}
	_this.meshSetSelected = function(id) {
		_meshSelected = id;
		drawMeshes(_meshCTX);
	}
	_this.getMesh = function(id) {
		return _meshes[id];
	}
	_this.deleteMesh = function(id) {
		if (_meshes[id]) {
			delete _meshes[id];
			drawMeshes(_meshCTX);
		}
	}
	//舞台信息接口
	_this.svgContent = function() {
		return _helperCTX;
	}
	_this.getMousePosition = function() {
		return _mouse.clone();
	}
	_this.bindStage = function(stage) {
		_children = stage.children();
	}
	_this.changeView = function(view) {
		_type = view;
		_this.fresh();
		outputCamera();
	}
	_this.getView = function() {
		return _type;
	}
	_this.getColor = function(type) {
		if (type == "select") return _meshSelectColor;
		if (type == "hover") return _meshHoverColor;
		if (!type) {
			if (_type == "xoz") {
				return ["#ff0000", "#4285F4"];
			} else if (_type == "xoy") {
				return ["#ff0000", "#3E9B1C"];
			} else {
				return ["#3E9B1C", "#4285F4"];
			}
		}
	}
	_this.resize = function(width, height) {
		_gridCanvas.width = _width = width;
		_gridCanvas.height = _height = height;
		_meshCanvas.width = _width;
		_meshCanvas.height = _height;
		_helperContainer.style.width = _width + "px";
		_helperContainer.style.height = _height + "px";
		_this.fresh();
	}
	//舞台渲染接口
	_this.fresh = function() {
		drawGrid(_gridCTX);
		render(_meshCTX);
		outputFreshHandle();
	}
	_this.reDraw = function() {
		drawMeshes(_meshCTX);
	}
	//摄像机接口
	_this.lookAt = function(dx, dy, dontFreshMesh) {
		_offset.x += dx * _scale;
		_offset.y += dy * _scale;
		_this.fresh();
		outputCamera();
	}
	_this.zoomTo = function(v) {
		_offset.x = _offset.x / _scale;
		_offset.y = _offset.y / _scale;
		_scale = 5.5 * (1 - 0.01 * v);
		if (_scale < 0.5) _scale = 0.5;
		if (_scale > 6) _scale = 6;
		_offset.x = _offset.x * _scale;
		_offset.y = _offset.y * _scale;
		_this.fresh();
		outputCamera();
	}
	_this.zoomCamara = function(a) {
		_offset.x = _offset.x / _scale;
		_offset.y = _offset.y / _scale;
		if (a) {
			_scale = Math.max(_scale - 0.1, 0.5);
		} else {
			_scale = Math.min(_scale + 0.1, 6);
		}
		_offset.x = _offset.x * _scale;
		_offset.y = _offset.y * _scale;
		_this.fresh();
		outputCamera();
	}
	//辅助器接口
	_this.toggleAxis = function() {
		_showGrid = !_showGrid;
		if (_showGrid) {
			drawGrid(_gridCTX);
		} else {
			_gridCTX.clearRect(0, 0, _width, _height);
		}
	}
	_this.resizeGrid = function(a) {
		if (a) {
			_cellSize = Math.min(_cellSize * 2, 400)
		} else {
			_cellSize = Math.max(_cellSize / 2, 25);
		}
		drawGrid(_gridCTX);
	}
	_this.setGridColor = function(e) {
		_gridColor = e;
		drawGrid(_gridCTX);
	}
	//事件接口
	_this.addListener = function(type, func) {
		_event[type] = func;
	}
	_this.removeListener = function(type) {
		_event[type] = null;
	}
	return _this;
}
})(jQuery);