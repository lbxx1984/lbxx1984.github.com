


function createGeometry(param){
	var tm=null;
	var mesh=null;
	var geo=null;
	var	rotation=null;
	var map = THREE.ImageUtils.loadTexture( 'textures/ash_uvgrid01.jpg' );
		map.wrapS = map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 16;
	var material = new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: map, side: THREE.DoubleSide } );
	var center=new THREE.Vector3();
		center.x=(param.mouseDown.x+param.mouseUp.x)/2;
		center.y=(param.mouseDown.y+param.mouseUp.y)/2;
		center.z=(param.mouseDown.z+param.mouseUp.z)/2;
	if(param.type="plane"){
		geo=new THREE.PlaneGeometry(
			Math.abs(param.mouseUp.x-param.mouseDown.x),
			Math.abs(param.mouseUp.z-param.mouseDown.z),
			2,2
		);
		rotation={x:Math.PI*0.5,y:0,z:0};
	}
	mesh=new THREE.Mesh( geo,material);
	mesh.rotation.x=rotation.x;
	mesh.rotation.y=rotation.y;
	mesh.rotation.z=rotation.z;
	mesh.material.opacity=0.5;
	mesh.id=param.type+new Date().getTime();
	mesh.position.set(center.x,center.y,center.z);
	stage.$3d.addGeometry(mesh);
	ui.scene.addItem("mesh",mesh.id);
}

function updateTemporaryGeometry(down,up){
	if(temporaryGeometry.mesh){
		stage.scene.remove(temporaryGeometry.mesh);
	}
	createTemporaryGeometry({mouseDown:down,mouseUp:up,type:config.tool});
	stage.scene.add(temporaryGeometry.mesh);
}

function createTemporaryGeometry(param){
	var geo=null;
	var	rotation=null;
	var center=new THREE.Vector3();
		center.x=(param.mouseDown.x+param.mouseUp.x)/2;
		center.y=(param.mouseDown.y+param.mouseUp.y)/2;
		center.z=(param.mouseDown.z+param.mouseUp.z)/2;
	if(param.type=="g_plane"){
		geo=new THREE.PlaneGeometry(
			Math.abs(param.mouseUp.x-param.mouseDown.x),
			Math.abs(param.mouseUp.z-param.mouseDown.z),
			2,2
		);
		rotation={x:Math.PI*0.5,y:0,z:0};
	}
	temporaryGeometry.mesh=new THREE.Mesh(geo,temporaryGeometry.material);
	temporaryGeometry.mesh.rotation.x=rotation.x;
	temporaryGeometry.mesh.rotation.y=rotation.y;
	temporaryGeometry.mesh.rotation.z=rotation.z;
	temporaryGeometry.mesh.position.set(center.x,center.y,center.z);
}