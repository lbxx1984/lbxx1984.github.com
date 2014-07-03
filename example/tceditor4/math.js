

var tcMath={};


//世界坐标转换成本地坐标
tcMath.Global2Local=function(p,q,r,mesh){
	var d1=p-mesh.position.x;
	var d2=q-mesh.position.y;
	var d3=r-mesh.position.z;
	var matrix=tcMath.rotateMatrix(mesh);
	var a1=matrix[0][0],b1=matrix[0][1],c1=matrix[0][2];
	var a2=matrix[1][0],b2=matrix[1][1],c2=matrix[1][2];
	var a3=matrix[2][0],b3=matrix[2][1],c3=matrix[2][2];    
	var d=a1*b2*c3+b1*c2*a3+c1*a2*b3-c1*b2*a3-b1*a2*c3-a1*c2*b3;
	var e=d1*b2*c3+b1*c2*d3+c1*d2*b3-c1*b2*d3-b1*d2*c3-d1*c2*b3;
	var f=a1*d2*c3+d1*c2*a3+c1*a2*d3-c1*d2*a3-d1*a2*c3-a1*c2*d3; 
	var g=a1*b2*d3+b1*d2*a3+d1*a2*b3-d1*b2*a3-b1*a2*d3-a1*d2*b3;
	var x=e/d;
	var y=f/d;
	var z=g/d;	
	x=x/mesh.scale.x;
	y=y/mesh.scale.y;
	z=z/mesh.scale.z;
	return [x,y,z];
}

//本地坐标转换成世界坐标
tcMath.Local2Global=function(x,y,z,m,o){
	var pos=tcMath.axisScale(x,y,z,o.scale);
	pos=tcMath.axisRotate(pos[0],pos[1],pos[2],m);
	pos=tcMath.axisTranslate(pos[0],pos[1],pos[2],o.position);	
	return pos;
}
	
//坐标平移变换
tcMath.axisTranslate=function(x,y,z,position){
	return [x+position.x,y+position.y,z+position.z];
}

//坐标缩放变化
tcMath.axisScale=function(x,y,z,scale){
	return [x*scale.x,y*scale.y,z*scale.z];	
}
	
//坐标旋转变换
tcMath.axisRotate=function(x,y,z,matrix){
	var rx=matrix[0][0]*x+matrix[0][1]*y+matrix[0][2]*z;
	var ry=matrix[1][0]*x+matrix[1][1]*y+matrix[1][2]*z;
	var rz=matrix[2][0]*x+matrix[2][1]*y+matrix[2][2]*z;
	return [rx,ry,rz];
}
	
//坐标旋转矩阵
tcMath.rotateMatrix=function(obj){	
	var x={x:1,y:0,z:0};
	var y={x:0,y:1,z:0};
	var z={x:0,y:0,z:1};			
	//y轴z轴绕x轴旋转
	y=rotating(y,x,obj.rotation.x);
	z=rotating(z,x,obj.rotation.x);	
	//x轴z轴绕y轴旋转
	x=rotating(x,y,obj.rotation.y);
	z=rotating(z,y,obj.rotation.y);
	//x轴y轴绕z轴旋转
	x=rotating(x,z,obj.rotation.z);
	y=rotating(y,z,obj.rotation.z);			
	//旋转.p为目标点, a为旋转轴, theta为旋转角度, WebGL使用右手坐标系, 传入的theta要取反, 然后计算方向余弦和角度正弦余弦, 提高计算速度
	function rotating(p,a,theta){	
		theta=-theta;	
		var d=Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z);
		var nx=-a.x/d;
		var ny=-a.y/d;
		var nz=-a.z/d;
		var cos=Math.cos(theta);
		var sin=Math.sin(theta);
		var fcos=1-cos;		
		//坐标变化
		var x=	p.x* ( nx*nx*fcos+	cos	  )+ p.y* ( nx*ny*fcos-nz*sin )+ p.z* ( nx*nz*fcos+ny*sin );
		var y=	p.x* ( nx*ny*fcos+ nz*sin )+ p.y* ( ny*ny*fcos+	  cos )+ p.z* ( ny*nz*fcos-nx*sin );		
		var z=  p.x* ( nx*nz*fcos- ny*sin )+ p.y* ( ny*nz*fcos+nx*sin )+ p.z* ( nz*nz*fcos+	  cos );		
		return {x:x,y:y,z:z}
	}
	//		
	return [
		[x.x,y.x,z.x],
		[x.y,y.y,z.y],
		[x.z,y.z,z.z]
	];			
}
	