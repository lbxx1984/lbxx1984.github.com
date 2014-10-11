var config={
	language:"en",
	width:0,
	height:0,
	tool:"cameramove",
	view:"3d",
	colors:{
		renderer:"2A333A",
		grid:"999999",
		mesh:"F0F0F0",
		select:"FFFF00",
		hover:"D97915"
	},
	geometry:{
		selected:""
	},
	mouse:{
		down_3d:new THREE.Vector3(),
		down_2d:new THREE.Vector3(),
		up_3d:new THREE.Vector3(),
		up_2d:new THREE.Vector3(),
		isDown:false		
	},
	light:[
		{id:"point_white_y+",type:"PointLight",color:0xffffff,intensity:1.5,distance:3000,position:[0,900,0]}
	],
	material:[
		{id:"default",type:"MeshLambertMaterial",color:0xFFFFFF,side:THREE.DoubleSide},
		{id:"MeshLambert #FFFFFF",type:"MeshLambertMaterial",color:0xFFFFFF, side:THREE.DoubleSide},
		{id:"MeshLambert #FF0000",type:"MeshLambertMaterial",color:0xFF0000, side:THREE.DoubleSide},
		{id:"MeshLambert #00FF00",type:"MeshLambertMaterial",color:0x00FF00, side:THREE.DoubleSide},		
		{id:"MeshLambert #0000FF",type:"MeshLambertMaterial",color:0x0000FF, side:THREE.DoubleSide},	
		{id:"MeshBasic #FFFFFF",type:"MeshBasicMaterial",color:0xFFFFFF,side:THREE.DoubleSide},
		{id:"MeshBasic #FFFF00",type:"MeshBasicMaterial",color:0xFF0000,side:THREE.DoubleSide},
		{id:"MeshBasic #00FF00",type:"MeshBasicMaterial",color:0x00FF00,side:THREE.DoubleSide},
		{id:"MeshBasic #0000FF",type:"MeshBasicMaterial",color:0x0000FF,side:THREE.DoubleSide},
		{id:"temporary",type:"MeshBasicMaterial",color:0xFFFF00,side:THREE.DoubleSide}
	],
	msg:{
		"en":{
			"deleteMesh":"Are you sure to delete this geometry?",
			"deleteLight":"Are you sure to delete this light?"	
		}
	}
}