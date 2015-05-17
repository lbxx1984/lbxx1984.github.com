/**
 * 全局配置信息
 */
var config = {
    /**语言种类*/
    language: 'en',
    /**整个工作区的宽度*/
    width: 0,
    /**整个工作区的高度*/
    height: 0,
    /**当前处于激活状态的控制开关*/
    tool: 'cameramove',
    /**当前主编辑器的视角*/
    view: '3d',
    /**编辑器有关的配色方案*/
    colors: {
        //编辑器背景颜色
        renderer: '2A333A',
        //编辑器辅助网格的颜色
        grid: '999999',
        //2D编辑器中普通物体的颜色
        mesh: 'F0F0F0',
        //2D编辑器中被选中物体的颜色
        select: 'FFFF00',
        //2D编辑器中鼠标下物体的颜色
        hover: 'D97915'
    },
    /**物体操作控制信息*/
    geometry: {
        //编辑器中被选中的物体的id
        selected: ''
    },
    /**编辑鼠标实时信息，这些信息不分编辑*/
    mouse: {
        //鼠标按下时对应的3D空间位置
        down_3d: new THREE.Vector3(),
        //鼠标按下时在编辑器DOM中的位置
        down_2d: new THREE.Vector3(),
        //鼠标抬起时对应的3D空间位置
        up_3d: new THREE.Vector3(),
        //鼠标抬起时在编辑器DOM中的位置
        up_2d: new THREE.Vector3(),
        //鼠标是否被按下了
        isDown: false
    },
    /**系统自带的灯光*/
    light: [{
        tid: 'point_white_y+',
        type: 'PointLight',
        color: 0xffffff,
        intensity: 1.5,
        distance: 3000,
        position: [0, 900, 0]
    }],
    /**系统自带的材质*/
    material: [{
        tid: 'default',
        type: 'MeshLambertMaterial',
        color: 0xFFFFFF
    }, {
        tid: 'MeshLambert #FFFFFF',
        type: 'MeshLambertMaterial',
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    }, {
        tid: 'MeshLambert #FF0000',
        type: 'MeshLambertMaterial',
        color: 0xFF0000,
        side: THREE.DoubleSide
    }, {
        tid: 'MeshLambert #00FF00',
        type: 'MeshLambertMaterial',
        color: 0x00FF00,
        side: THREE.DoubleSide
    }, {
        tid: 'MeshLambert #0000FF',
        type: 'MeshLambertMaterial',
        color: 0x0000FF,
        side: THREE.DoubleSide
    }, {
        tid: 'MeshBasic #FFFFFF',
        type: 'MeshBasicMaterial',
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    }, {
        tid: 'MeshBasic #FFFF00',
        type: 'MeshBasicMaterial',
        color: 0xFF0000,
        side: THREE.DoubleSide
    }, {
        tid: 'MeshBasic #00FF00',
        type: 'MeshBasicMaterial',
        color: 0x00FF00,
        side: THREE.DoubleSide
    }, {
        tid: 'MeshBasic #0000FF',
        type: 'MeshBasicMaterial',
        color: 0x0000FF,
        side: THREE.DoubleSide
    }, {
        tid: 'temporary',
        type: 'MeshBasicMaterial',
        color: 0xFFFF00,
        side: THREE.DoubleSide,
        wireframe: true
    }],
    /**用于alert提示的文本分语言常量，也就是语言包*/
    msg: {
        'en': {
            'deleteMesh': 'Are you sure to delete this geometry?',
            'deleteLight': 'Are you sure to delete this light?'
        }
    }
};