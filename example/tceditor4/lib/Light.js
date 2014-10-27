function Light() {
	this.stage = null;
	this.scene = null;
	this.children = {};
	this.selected = null;
	this.controller = null;
}
Light.prototype.bind = function(s) {
	var _this = this;
	this.stage = s.$3d;
	this.scene = this.stage.getScene();
	this.controller = new THREE.TransformControls(this.stage.getCamera(), this.stage.getRenderer().domElement);
	this.controller.setMode("translate");
	this.controller.setSpace("world");
	this.controller.onChange = function() {
		if (!_this.children[_this.selected]) return;
		var pos = _this.children[_this.selected].point.position;
		_this.children[_this.selected].light.position.set(pos.x, pos.y, pos.z);
	};
}
Light.prototype.lock = function(id) {
	if (!this.children[id]) return;
	this.children[id].locked = true;
	if (id = this.selected) this.detach();
}
Light.prototype.unlock = function(id) {
	if (!this.children[id]) return;
	this.children[id].locked = null;
}
Light.prototype.update = function(fromScene) {
	if (fromScene) {
		if (this.selected != null) this.controller.update();
		return;
	}
	var camera, camerapos, lightpos, point, light
	camera = this.stage.getCamera();
	camerapos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
	for (var key in this.children) {
		point = this.children[key].point;
		light = this.children[key].light;
		lightpos = new THREE.Vector3(point.position.x, point.position.y, point.position.z);
		point.scale.x = point.scale.y = point.scale.z = lightpos.distanceTo(camerapos) / 1500;
	}
}
Light.prototype.detach = function() {
	this.selected = null;
	this.controller.detach();
	this.scene.remove(this.controller);
}
Light.prototype.attach = function(id) {
	if (!this.children[id] || this.children[id].locked) return;
	this.selected = id;
	this.controller.attach(this.children[id].point);
	this.scene.add(this.controller);
}
Light.prototype.hide = function(id) {
	if (!this.children[id]) return;
	this.scene.remove(this.children[id].point);
	this.scene.remove(this.children[id].light);
}
Light.prototype.visible = function(id) {
	if (!this.children[id]) return;
	this.scene.add(this.children[id].point);
	this.scene.add(this.children[id].light);
}
Light.prototype.delete = function(id) {
	this.hide(id);
	delete this.children[id];
}
Light.prototype.load = function(arr) {
	if (!(arr instanceof Array)) return;
	var point, light;
	for (var n = 0; n < arr.length; n++) {
		if (this.children[arr[n].tid]) continue;
		point = new THREE.Mesh(
			new THREE.SphereGeometry(10, 8, 8),
			new THREE.MeshBasicMaterial({
				color: arr[n].color
			})
		);
		light = new THREE[arr[n].type](
			arr[n].color,
			arr[n].intensity,
			arr[n].distance
		);
		point.position.x = light.position.x = arr[n].position[0];
		point.position.y = light.position.y = arr[n].position[1];
		point.position.z = light.position.z = arr[n].position[2];
		this.scene.add(point);
		this.scene.add(light);
		this.children[arr[n].tid] = {
			point: point,
			light: light
		}
	}
	this.update();
}