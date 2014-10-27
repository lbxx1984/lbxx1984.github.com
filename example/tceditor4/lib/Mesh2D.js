// JavaScript Document
function Mesh2D(param) {
	this.geo = param.geo;
	this.visible = true;
	this.locked = false;
	this.displayType = param.type;
	this.width = param.width;
	this.height = param.height;
	this.offset = param.offset;
	this.scale = param.scale;
	this.meshColor = param.meshColor;
	this.center = [0, 0];
	this.points = [];
	this.faces = [];
	this.createPoints();
	this.createFaces();
}
Mesh2D.prototype.translate = function (dx, dy) {
	for (var n = 0; n < this.points.length; n++) {
		this.points[n][0] += dx;
		this.points[n][1] += dy;
	}
}
Mesh2D.prototype.reset = function(color) {
	this.points = [];
	this.faces = [];
	this.center = [0, 0];
	this.createPoints();
	this.createFaces();
}
Mesh2D.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.lineWidth = 1;
	var faces = this.faces;
	var points = this.points;
	for (var n = 0; n < faces.length; n++) {
		this.drawline(
			points[faces[n][0]][0], points[faces[n][0]][1],
			points[faces[n][1]][0], points[faces[n][1]][1],
			ctx
		);
		this.drawline(
			points[faces[n][1]][0], points[faces[n][1]][1],
			points[faces[n][2]][0], points[faces[n][2]][1],
			ctx
		);
		this.drawline(
			points[faces[n][2]][0], points[faces[n][2]][1],
			points[faces[n][0]][0], points[faces[n][0]][1],
			ctx
		);
	}
}
Mesh2D.prototype.createFaces = function() {
	var points = this.points;
	var faces = this.geo.geometry.faces;
	for (var n = 0; n < faces.length; n++) {
		this.faces.push([faces[n].a, faces[n].b, faces[n].c]);
	}
}
Mesh2D.prototype.createPoints = function() {
	var matrix = tcMath.rotateMatrix(this.geo);
	this.center = this.RectangularToDisplay(tcMath.Local2Global(0, 0, 0, matrix, this.geo));
	for (var n = 0; n < this.geo.geometry.vertices.length; n++) {
		this.points.push(
			this.RectangularToDisplay(
				tcMath.Local2Global(
					this.geo.geometry.vertices[n].x,
					this.geo.geometry.vertices[n].y,
					this.geo.geometry.vertices[n].z,
					matrix,
					this.geo
				)
			)
		);
	}
}
Mesh2D.prototype.drawline = function(x0, y0, x1, y1, ctx) {
	var d = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
	var r = 1;
	var sina = (x1 - x0) / d;
	var cosa = (y1 - y0) / d;
	ctx.moveTo(x0 + r * cosa, y0 - r * sina);
	ctx.lineTo(x0 + r * cosa + x1 - x0, y0 - r * sina + y1 - y0);
	ctx.lineTo(x0 - r * cosa + x1 - x0, y0 + r * sina + y1 - y0);
	ctx.lineTo(x0 - r * cosa, y0 + r * sina);
	ctx.lineTo(x0 + r * cosa, y0 - r * sina);
}
Mesh2D.prototype.RectangularToDisplay = function(pos) {
	var x = 0,
		y = 0;
	if (this.displayType == "xoz") {
		x = pos[0];
		y = pos[2];
	} else if (this.displayType == "xoy") {
		x = pos[0];
		y = pos[1];
	} else if (this.displayType == "yoz") {
		x = pos[1];
		y = pos[2];
	}
	x = this.width * 0.5 + (x + this.offset.x) / this.scale;
	y = this.height * 0.5 - (y + this.offset.y) / this.scale;
	return [x, y];
}
Mesh2D.prototype.DisplayToRectangular = function(dx, dy) {
	dy = -dy;
	dy = dy * this.scale - this.offset.y;
	dx = dx * this.scale - this.offset.x;
	if (this.displayType == "xoz") {
		return [dx, 0, dy];
	} else if (this.displayType == "xoy") {
		return [dx, dy, 0];
	} else if (this.displayType == "yoz") {
		return [0, dx, dy];
	}
}