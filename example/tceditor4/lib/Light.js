/**
 * 灯光系统
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
/**
 * @constructor
 */
function Light() {
    /**灯光工作的舞台*/
    this.stage = null;
    /**舞台里的场景*/
    this.scene = null;
    /**舞台里的所有灯光hash表*/
    this.children = {};
    /**被选中待操作的灯光id*/
    this.selected = null;
    /**负责拖动灯光的控制器，transformer3D的阉割版*/
    this.controller = null;
}
/**
 * 为灯光系统绑定舞台，并初始化灯光控制器
 * @param {Object} s 舞台对象，见Stage.js
 */
Light.prototype.bind = function(s) {
    var _this = this;
    this.stage = s.$3d;
    this.scene = this.stage.getScene();
    this.controller = new THREE.TransformControls(
                        this.stage.getCamera(),
                        this.stage.getRenderer().domElement
                    );
    this.controller.setMode("translate");
    this.controller.setSpace("world");
    this.controller.onChange = function() {
        if (!_this.children[_this.selected]) return;
        var pos = _this.children[_this.selected].point.position;
        _this.children[_this.selected].light.position.set(pos.x, pos.y, pos.z);
    };
}
/**
 * 锁定绑定的灯光
 * @param {number} id 灯光的id
 */
Light.prototype.lock = function(id) {
    if (!this.children[id]) return;
    this.children[id].locked = true;
    if (id == this.selected) this.detach();
}
/**
 * 解锁绑定的灯光
 * @param {number} id 灯光的id
 */
Light.prototype.unlock = function(id) {
    if (!this.children[id]) return;
    this.children[id].locked = null;
}
/**
 * 刷新灯光系统
 * @param {boolean} fromScene 刷新行为是否由舞台里的心跳函数触发
 *     此方法作用为：如果是舞台心跳函数触发的刷新，并且有灯光被选中，就调用灯光
 * 控制器的刷新方法。如果不是舞台心跳函数触发，而是由舞台缩放触发，就根据摄像机
 * 的位置改变灯光徽标的大小，以保证灯光徽标看上去大小适中不变。
 */
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
/**
 * 卸载灯光控制器
 */
Light.prototype.detach = function() {
    this.selected = null;
    this.controller.detach();
    this.scene.remove(this.controller);
}
/**
 * 为灯光控制器挂载灯光
 * @param {number} id 灯光id
 */
Light.prototype.attach = function(id) {
    if (!this.children[id] || this.children[id].locked) return;
    this.selected = id;
    this.controller.attach(this.children[id].point);
    this.scene.add(this.controller);
}
/**
 * 隐藏某个灯光
 * @param {number} id 灯光id
 */
Light.prototype.hide = function(id) {
    if (!this.children[id]) return;
    this.scene.remove(this.children[id].point);
    this.scene.remove(this.children[id].light);
}
/**
 * 显示某个灯光
 * @param {number} id 灯光id
 */
Light.prototype.visible = function(id) {
    if (!this.children[id]) return;
    this.scene.add(this.children[id].point);
    this.scene.add(this.children[id].light);
}
/**
 * 删除某个灯光
 * @param {number} id 灯光id
 */
Light.prototype.delete = function(id) {
    this.hide(id);
    delete this.children[id];
}
/**
 * 根据配置中批量创建灯光
 * @param {Array} arr 灯光配置数组
 */
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