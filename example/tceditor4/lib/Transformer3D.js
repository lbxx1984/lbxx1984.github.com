/**
 * 物体变换器 3D子组成
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
/**
 * 构造函数
 * @constructor
 * @param {Object} stage3D编辑器对象，对应Stage3D.js
 * @return {Object} 本变换器对外暴露的接口
 */
function Transformer3D(stage) {


    var _camera = stage.getCamera();
    var _renderer = stage.getRenderer();
    var _scene = stage.getScene();
    var _trans = new THREE.TransformControls(_camera, _renderer.domElement);
    var _onDetach = null;
    _trans.onMouseRightButtonClick = function() {
        if (_onDetach) {
            _onDetach();
        }
    }


    return {
        /**
         * 设置变形器的工作模式，平移、缩放、旋转
         * @param {string} value 工作模式：translate|scale|rotate
         */
        setMode: function(value) {
            _trans.setMode(value);
        },
        /**
         * 设置变形器操作徽标大小
         * @param {number} value 大于，范围[0,2]
         */
        setSize: function(value) {
            _trans.setSize(value);
        },
        /**
         * 获取当前操作徽标大小
         * @return {number} 变换器3D徽标大小
         */
        getSize: function() {
            return _trans.size;
        },
        /**
         * 设置变形器的工作空间，世界空间、物体本地空间
         * @param {string} v 空间标识：world|local
         */
        setSpace: function(value) {
            _trans.setSpace(value);
        },
        /**
         * 3D组件的心跳，由外部触发
         */
        update: function() {
            _trans.update();
        },
        /**
         * 为变形器解绑物体
         */
        detach: function() {
            _trans.detach();
            _scene.remove(_trans);
        },
        /**
         * 为变形器绑定物体
         * @param {Object} geo 3D物体对象
         */
        attach: function(geo) {
            _trans.attach(geo);
            _scene.add(_trans);
        },
        /**
         * 注册onDetach事件句柄，此事件在变换器物体被卸载后触发
         * @param {function} func 回调事件句柄
         */
        onDetach: function(func) {
            _onDetach = func;
        },
        /**
         * 注册onChange事件句柄，此事件在物体发生变换时触发
         * @param {function} func 回调事件句柄
         */
        onChange: function(func) {
            _trans.onChange = func;
        },
        /**
         * 注册onFinish事件句柄，此事件在物体发生变换结束后触发
         * @param {function} func 回调事件句柄
         */ 
        onFinish: function(func) {
            _trans.onFinish = func;
        }
    }
}