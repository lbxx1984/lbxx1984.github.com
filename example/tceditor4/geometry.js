/*
    var map = THREE.ImageUtils.loadTexture( 'textures/ash_uvgrid01.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
    var material = new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, 
    map: map, side: THREE.DoubleSide } );
*/
/**
 * 这里的方法都是临时的，以后还要重写并封装
 */
/**
 * 根据鼠标位置的变化创建物体，并将这个物体添加到舞台
 * @param {Object} param 鼠标动作描述
 * @param {Object} param.mouseDown 鼠标按下的3D坐标
 * @param {Object} param.mouseUp 鼠标抬起时的3D坐标
 * @param {string} param.type 想要创建的物体的类型
 */
function createGeometry(param) {
    var mesh = null;
    var geo = null;
    var rotation = null;
    var center = new THREE.Vector3();
    center.x = (param.mouseDown.x + param.mouseUp.x) / 2;
    center.y = (param.mouseDown.y + param.mouseUp.y) / 2;
    center.z = (param.mouseDown.z + param.mouseUp.z) / 2;
    if (param.type = "plane") {
        geo = new THREE.PlaneGeometry(
            Math.abs(param.mouseUp.x - param.mouseDown.x),
            Math.abs(param.mouseUp.z - param.mouseDown.z),
            5, 5
        );
        rotation = {
            x: Math.PI * 0.5,
            y: 0,
            z: 0
        };
    }

    mesh = new THREE.Mesh(geo, material.get("MeshLambert #FFFFFF"));
    mesh.rotation.x = rotation.x;
    mesh.rotation.y = rotation.y;
    mesh.rotation.z = rotation.z;

    mesh.tid = param.type + new Date().getTime();
    mesh.position.set(center.x, center.y, center.z);
    stage.$3d.addGeometry(mesh);
    ui.addItem("mesh", mesh.tid);
}

/**
 * 鼠标拖动时，更新舞台中的临时物体
 * @param {Object} down 鼠标按下的3D坐标
 * @param {Object} up 鼠标抬起时的3D坐标
 */
function updateTemporaryGeometry(down, up) {
    if (temporaryGeometry.mesh) {
        stage.scene.remove(temporaryGeometry.mesh);
    }
    createTemporaryGeometry({
        mouseDown: down,
        mouseUp: up,
        type: config.tool
    });
    stage.scene.add(temporaryGeometry.mesh);
}

/**
 * 根据鼠标状态创建临时物体
 * @param {Object} param 鼠标动作描述
 * @param {Object} param.mouseDown 鼠标按下的3D坐标
 * @param {Object} param.mouseUp 鼠标抬起时的3D坐标
 * @param {string} param.type 想要创建的物体的类型
 */
function createTemporaryGeometry(param) {
    var geo = null;
    var rotation = null;
    var center = new THREE.Vector3();
    center.x = (param.mouseDown.x + param.mouseUp.x) / 2;
    center.y = (param.mouseDown.y + param.mouseUp.y) / 2;
    center.z = (param.mouseDown.z + param.mouseUp.z) / 2;
    if (param.type == "g_plane") {
        var x = Math.abs(param.mouseUp.x - param.mouseDown.x);
        var z = Math.abs(param.mouseUp.z - param.mouseDown.z);
        var step = 5;
        geo = new THREE.PlaneGeometry(
            Math.abs(param.mouseUp.x - param.mouseDown.x),
            Math.abs(param.mouseUp.z - param.mouseDown.z),
            step,
            step
        );
        rotation = {
            x: Math.PI * 0.5,
            y: 0,
            z: 0
        };
    }
    temporaryGeometry.mesh = new THREE.Mesh(geo, temporaryGeometry.material);
    temporaryGeometry.mesh.rotation.x = rotation.x;
    temporaryGeometry.mesh.rotation.y = rotation.y;
    temporaryGeometry.mesh.rotation.z = rotation.z;
    temporaryGeometry.mesh.position.set(center.x, center.y, center.z);
}