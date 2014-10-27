
var ui = new UI(control_routing); //UI接口
var stage = new Stage(); //主编辑器
var transformer = new Transformer(); //变换器，用于平移、旋转、缩放物体
var morpher = new Morpher(); //变形器，也叫关节编辑器，用于变换物体形状
var light = new Light(); //灯光控制器
var material = new Material(); //材质生成器

var temporaryGeometry = {
		mesh: null,
		material: null
	} //TODO


//启动入口
function main() {
	
	if (!Detector.webgl) {
		document.body.innerHTML = "";
		document.body.style.color = "#000";
		document.body.style.backgroundColor = "#fff";
		Detector.addGetWebGLMessage();
	} else {
		//初始化
		onResize();
		stage.bind(
			$("#stage2d").Stage2D({
				width: config.width,
				height: config.height,
				clearColor: "#" + config.colors.renderer,
				gridColor: "#" + config.colors.grid,
				meshColor: "#" + config.colors.mesh,
				meshSelectColor: "#" + config.colors.select,
				meshHoverColor: "#" + config.colors.hover,
				showGrid: true
			}),
			$("#stage3d").Stage3D({
				width: config.width,
				height: config.height,
				clearColor: parseInt(config.colors.renderer, 16),
				gridColor: parseInt(config.colors.grid, 16),
				showGrid: true
			}),
			$("#cameraController").CameraController({
				width: 100,
				height: 100,
				showAxis: true,
				animate: false,
				language: config.language
			})
		);
		transformer.bind(stage);
		morpher.bind(stage);
		light.bind(stage);
		light.load(config.light);
		material.load(config.material);
		//绑定事件
		$(window)
			.bind("resize", onResize);
		$("#workspace")
			.bind("mousedown", mousedown)
			.bind("mouseup", mouseup)
			.bind("mousemove", mousemove)
			.bind("contextmenu", mouseRightClick);
		stage.addListener("onCameraChange", function(p, l, r) {
			ui.scene.setCameraInformation(p, l, r);
			morpher.resizeJoint();
			light.update();
			light.update(true);
		});
		stage.addListener("onFresh", function() {
			morpher.reloadJoint();
			transformer.$2d.update();
		});
		stage.addListener("onMesh3DFresh", function() {
			morpher.reloadJoint();
			ui.scene.reloadMeshVetrices(config.geometry.selected);
		})
		transformer.onFinish( function() {
			if(config.geometry.selected != null) {
				ui.scene.freshMeshPRS(stage.getGeometryByID(config.geometry.selected));
				ui.scene.reloadMeshVetrices(config.geometry.selected);
			}	
		});
		morpher.onChange(function(index) {
			ui.scene.freshMeshVector(
				stage.getGeometryByID(config.geometry.selected),
				index
			);
		});
		//手动刷新显示面板	
		stage.cameraMove(0, 0);
		ui.scene.setColors("renderer", "#" + config.colors.renderer);
		ui.scene.setColors("grid", "#" + config.colors.grid);
		ui.scene.gridVisible(true);
		ui.scene.addLights(light.children);
		ui.scene.addMaterials(material.children);
		//TODO
		temporaryGeometry.material = material.get("temporary");

	}
}


//控制路由器
function control_routing(param) {
	//视图切换命令
	if (param.type == "view" && config.view != param.cmd) {
		config.view = param.cmd;
		stage.changeTo(config.view);
		return;
	}
	//一次性命令
	if (param.type == "click" || param.type == "change") {
		switch (param.cmd) {
			case "light_select":
				light.attach(param.value);
				break;
			case "light_trash":
				if (confirm(config.msg[config.language].deleteLight)) {
					if (param.value == light.selected) light.detach();
					light.delete(param.value);
					param.dom.parentNode.removeChild(param.dom);
				}
				break;
			case "light_lock":
				light.lock(param.value);
				break;
			case "light_unlock":
				light.unlock(param.value);
				break;
			case "light_hide":
				light.hide(param.value);
				break;
			case "light_visible":
				light.visible(param.value);
				break;
				//以上TODO		
			case "mesh_joint":
				stage.meshTransform(param.geo, "joint", param.joint, param.value);
				break;
			case "mesh_sx":
				stage.meshTransform(param.geo, "scale", "x", param.value, param.sync);
				break;
			case "mesh_sy":
				stage.meshTransform(param.geo, "scale", "y", param.value, param.sync);
				break;
			case "mesh_sz":
				stage.meshTransform(param.geo, "scale", "z", param.value, param.sync);
				break;
			case "mesh_rx":
				stage.meshTransform(param.geo, "rotation", "x", param.value / 57.3);
				break;
			case "mesh_ry":
				stage.meshTransform(param.geo, "rotation", "y", param.value / 57.3);
				break;
			case "mesh_rz":
				stage.meshTransform(param.geo, "rotation", "z", param.value / 57.3);
				break;
			case "mesh_px":
				stage.meshTransform(param.geo, "position", "x", param.value);
				break;
			case "mesh_py":
				stage.meshTransform(param.geo, "position", "y", param.value);
				break;
			case "mesh_pz":
				stage.meshTransform(param.geo, "position", "z", param.value);
				break;
			case "mesh_select":
				selectGeometry(param.value);
				break;
			case "mesh_trash":
				if (confirm(config.msg[config.language].deleteMesh)) {
					if (param.value == config.geometry.selected) selectGeometry(-1);
					stage.meshDelete(param.value);
					ui.scene.selectMesh();
					param.dom.parentNode.removeChild(param.dom);
				}
				break;
			case "mesh_lock":
				if (param.value == config.geometry.selected) selectGeometry(-1);
				stage.meshLock(param.value, true);
				break;
			case "mesh_unlock":
				stage.meshLock(param.value, false);
				break;
			case "mesh_hide":
				if (param.value == config.geometry.selected) selectGeometry(-1);
				stage.meshVisible(param.value, false);
				break;
			case "mesh_visible":
				stage.meshVisible(param.value, true);
				break;
			case "renderer_color":
				stage.setRendererColor(param.value);
				break;
			case "grid_color":
				stage.setGridColor(param.value);
				break;
			case "grid_visible":
				stage.callFunc("toggleAxis");
				break;
			case "grid_hidden":
				stage.callFunc("toggleAxis");
				ui.scene.gridVisible();
				break;
			case "grid_show":
				stage.callFunc("toggleAxis");
				ui.scene.gridVisible();
				break;
			case "grid_big":
				stage.callFunc("resizeGrid", 1);
				break;
			case "grid_small":
				stage.callFunc("resizeGrid", 0);
				break;
			case "camera_r":
				stage.zoomTo(param.value);
				break;
			case "camera_zoomin":
				stage.callFunc("zoomCamara", 1);
				break;
			case "camera_zoomout":
				stage.callFunc("zoomCamara", 0);
				break;
			case "transformer_translate":
				transformer.setMode("translate");
				break;
			case "transformer_rotate":
				if (config.view != "3d") {
					alert("TODO ^_^");
					return;
				}
				transformer.setMode("rotate");
				break;
			case "transformer_scale":
				if (config.view != "3d") {
					alert("TODO ^_^");
					return;
				}
				transformer.setMode("scale");
				break;
			case "transformer_enlarge":
				transformer.setSize(1);
				break;
			case "transformer_narrow":
				transformer.setSize(-1);
				break;
			case "transformer_world":
				if (config.view != "3d") {
					alert("TODO ^_^");
					return true;
				}
				transformer.setSpace("world");
				break;
			case "transformer_local":
				if (config.view != "3d") {
					alert("TODO ^_^");
					return true;
				}
				transformer.setSpace("local");
				break;
			default:
				break;
		}
		return;
	}
	//状态持续命令
	//命令：创建物体。切换回3D场景并让摄像机脱离侧视状态
	if (param.cmd.indexOf("g_") > -1) {
		if (!stage.$3d.isGridLocked())
			stage.cameraController.cameraAngleTo({
				a: 45
			});
		if (config.view != "3d") {
			config.view = "3d";
			stage.changeTo("3d");
			ui.controlBar.changeView("3d");
		}
	}
	//清空选择器
	selectGeometry(-1);
	//设置命令
	config.tool = param.cmd;
}


//全局选择物体，负责物体控制和UI控制
function selectGeometry(id) {
	if (id == -1) {
		config.geometry.selected = null;
		light.detach();
		transformer.detach();
		morpher.detach();
		ui.affiliatedBar.hide();
		ui.scene.selectMesh();
	} else if (config.geometry.selected == id) {
		return;
	} else {
		var geo = stage.getGeometryByID(id);
		if (geo && !geo.locked && (config.tool == "transformer" || config.tool == "morpher")) {
			transformer.detach();
			morpher.detach();
			if (config.tool == "transformer") {
				transformer.attach(geo);
			} else {
				morpher.attach(geo);
			}
			ui.affiliatedBar.show(config.tool);
			ui.scene.selectMesh(id);
			config.geometry.selected = id;
		}
	}
}


//设置组件大小
function onResize() {
	var win = $(window),
		width = win.width(),
		height = win.height();
	config.width = width - 301;
	config.height = height - 72;
	$("#workspace").css({
		width: config.width + "px",
		height: config.height + "px"
	});
	$("#control").css({
		"width": config.width + "px"
	});
	$("#affiliatedButtons").css({
		"width": (config.width - 300) + "px"
	});
	$("#stage3d").css({
		width: config.width + "px",
		height: config.height + "px"
	});
	$("#stage2d").css({
		width: config.width + "px",
		height: config.height + "px"
	});
	stage.resize(config.width, config.height);
}