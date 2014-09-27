// JavaScript Document
function Transformer(camera, renderer, scene){
	
	var _trans= new THREE.TransformControls(camera,renderer.domElement);
	var _scene=scene;
	var _geometry=null;
	var _isWorking=false;
	var _onDetach=null;
	
	_trans.onMouseRightButtonClick=function(){
		_trans.detach();
		_scene.remove(_trans);
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
			if(_isWorking){
				_trans.detach();
				_scene.remove(_trans);
				_isWorking=false;
				if(_onDetach){_onDetach();}
			}
		},
		attach:function(geo){
			_trans.attach(geo);
			_scene.add(_trans);
			_isWorking=true;
		},
		onDetach:function(func){
			_onDetach=func;
		},
		onChange:function(func){
			_trans.onChange=func;
		},
		isWorking:function(){
			return _isWorking;
		}
	}
}