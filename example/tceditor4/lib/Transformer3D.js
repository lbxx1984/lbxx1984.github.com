// JavaScript Document
function Transformer3D(stage){
	var _stage=stage;
	var _camera=stage.getCamera();
	var _renderer=stage.getRenderer();
	var _scene=stage.getScene();
	var _trans= new THREE.TransformControls(_camera,_renderer.domElement);
	var _geometry=null;
	var _onDetach=null;
	

	_trans.onMouseRightButtonClick=function(){
		if(_onDetach){_onDetach();}	
	}
	
		
	return {
		setMode:function(value){
			_trans.setMode(value);	
		},
		setSize:function(value){
			_trans.setSize(value);	
		},
		getSize:function(){
			return _trans.size;
		},
		setSpace:function(value){
			_trans.setSpace(value);	
		},
		update:function(){
			_trans.update();
		},
		detach:function(){
			_trans.detach();
			_scene.remove(_trans);
		},
		attach:function(geo){
			_trans.attach(geo);
			_scene.add(_trans);
		},
		onDetach:function(func){
			_onDetach=func;
		},
		onChange:function(func){
			_trans.onChange=func;
		}
	}
}