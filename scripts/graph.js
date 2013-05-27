//-------------------------------------------------------------
// graphic engine
//-------------------------------------------------------------
function Color(red, green, blue, alpha) {
	this.red = red || 0;
	this.green = green || 0;
	this.blue = blue || 0;
	this.alpha = alpha || 1;
	if(this.red < 1 && this.red > 0)
		this.red = this.red * 255;
	if(this.green < 1 && this.green > 0)
		this.green = this.green * 255;
	if(this.blue < 1 && this.blue > 0)
		this.blue = this.blue * 255;
}
Color.prototype = new RootObject();
Color.prototype.getRed = function() { return this.red; }
Color.prototype.getGreen = function() { return this.green; }
Color.prototype.getBlue = function() { return this.blue; }
Color.prototype.getAlpha = function() { return this.alpha; }
Color.prototype.toString = function() {
	return "rgba(" +
		this.red + "," +
		this.green + "," +
		this.blue + "," +
		this.alpha + ")";
}
Color.fromRGBA = function(r, g, b, a) { return new Color(r, g, b, a); }
Color.BLACK = new Color();
Color.WHITE = new Color(255, 255, 255);
Color.RED = new Color(255, 0, 0);
Color.GREEN = new Color(0, 255, 0);
Color.BLUE = new Color(0, 0, 255);

function Pen(color, size) {
	this.color = color || Color.BLACK;
	this.size = size || 1;
}
Pen.prototype = new RootObject();
Pen.prototype.getColor = function() { return this.color; }
Pen.prototype.getSize = function() { return this.size; }

function Point2D(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}
Point2D.prototype = new RootObject();
Point2D.prototype.assign = function(other) {
	this.x = other.x;
	this.y = other.y;
	return this;
}
Point2D.prototype.getX = function() { return this.x; }
Point2D.prototype.getY = function() { return this.y; }
Point2D.prototype.distanceSquare = function(other) {
	var dx = other.x - this.x;
	var dy = other.y - this.y;
	return dx * dx + dy * dy;
}
Point2D.prototype.distance = function(other) {
	return Math.sqrt(this.distanceSquare(other));
}

//for vector
Point2D.prototype.add = function(other) {
	return new Point2D(this.x + other.x, this.y + other.y);
}
Point2D.prototype.addSelf = function(other) {
	this.x += other.x; this.y += other.y; return this;
}
Point2D.prototype.substract = function(other) {
	return new Point2D(this.x - other.x, this.y - other.y);
}
Point2D.prototype.substraceSelf = function(other) {
   	this.x -= other.x;
	this.y -= other.y;
	return this;
}
Point2D.prototype.scale = function(n) {
	return new Point2D(this.x * n, this.y * n);
}
Point2D.prototype.scaleSelf = function(n) {
   	this.x *= n;
	this.y *= n;
	return this;
}
Point2D.prototype.dotProduct = function(other) {
   	return this.x * other.x + this.y * other.y;
}
Point2D.prototype.direction = function() {
   	var d = 1 / Point2D.ORIGIN.distance(this);
	return this.scale(d);
}
Point2D.prototype.directionSelf = function() {
   	var d = 1 / Point2D.ORIGIN.distance(this);
	return this.scaleSelf(d);
}
Point2D.ORIGIN = new Point2D(0, 0);

function Rectangle(leftTop, width, height) {
	this.leftTop = leftTop;
	this.width = width;
	this.height = height;
}
Rectangle.prototype = new RootObject();
Rectangle.prototype.area = function() { return this.width * this.height;}
function TransformMatrix(m00, m01, m11, m12, transformVector) {
	this.m00 = m00 || 0;
	this.m01 = m01 || 0;
	this.m10 = m10 || 0;
	this.m11 = m11 || 0;
	this.transformVector = transformVector || new Point2D(0, 0);
}
TransformMatrix.prototype = new RootObject();
TransformMatrix.prototype.rotate = function(radian) { return this; }
TransformMatrix.prototype.transpose = function(dx, dy) { }
TransformMatrix.prototype.scale = function() { }

function CoordSystem(translateVector, rotateRadius, scaleVector) {
	this.translateVector = translateVector || new Point2D(0, 0);
	this.rotateRadius = rotateRadius || 0;
	this.scaleVector = scaleVector || new Point2D(1, 1);
}

function Graphics(ctx, pen, coordsys) {
	this.ctx = ctx;
	pen = pen || new Pen();
	this.setPen(pen);
	this.setCoordSystem(coordsys);
}
Graphics.prototype = new RootObject();
Graphics.CIRCLE_RADIAN = Math.PI * 2;

Graphics.prototype.getWidth = function() { return this.ctx.canvas.width; }
Graphics.prototype.getHeight = function() { return this.ctx.canvas.height; }
Graphics.prototype.setWidth = function(width) {
   	this.ctx.canvas.width = width; 
}
Graphics.prototype.setHeight = function(height) {
   	this.ctx.canvas.height = height; 
}
Graphics.prototype.getPen = function() { return this.pen; }
Graphics.prototype.setPen = function(pen) {
	this.pen = pen;
	this.ctx.fillStyle = pen.color.toString();
	this.ctx.strokeStyle = pen.color.toString();
	this.ctx.lineWidth = pen.size;
}
Graphics.prototype.getCoordSystem = function() { 
	return this.coordsys = (this.coordsys || new CoordSystem());
}
Graphics.prototype.setCoordSystem = function(coordsys) {
	if(!coordsys)
		return;
	if(coordsys.translateVector.x !== 0 || coordsys.translateVector.y !== 0)
		this.ctx.translate(coordsys.translateVector.x, coordsys.translateVector.y);
	if(coordsys.rotateRadius !== 0)
		this.ctx.rotate(coordsys.rotateRadius);
	if(coordsys.scaleVector.x !== 1 || coordsys.scaleVector.y !== 1)
		this.ctx.scale(coordsys.scaleVector.x, coordsys.scaleVector.y);
	this.coordsys = coordsys;
	return this;
}
Graphics.prototype.setTransform = function(m00, m01, m10, m11, dx, dy) {
	this.ctx.setTransform(m00, m01, m10, m11, dx, dy);
}
Graphics.prototype.clearTransform = function() {
	this.ctx.setTransform(1, 0, 0, 1, 1, 1);
}
Graphics.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
}
Graphics.prototype.clearRect = function(rect) {
	this.ctx.clearRect(rect.leftTop.x, rect.leftTop.y,
			rect.width, rect.height);
}
Graphics.prototype.begin = function() { this.ctx.beginPath(); }
Graphics.prototype.end = function() { this.ctx.closePath(); }
Graphics.prototype.lineTo = function(p1, p2) {
	this.ctx.moveTo(p1.x, p1.y);
	this.ctx.lineTo(p2.x, p2.y);
}
Graphics.prototype.bezierCurveTo = function(startPoint,
		controlPoint1,
		controlPoint2,
		endPoint) {
	this.ctx.moveTo(startPoint.x, startPoint.y);
	this.ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y,
			controlPoint2.x, controlPoint2.y,
			endPoint.x, endPoint.y);
}
Graphics.prototype.quadraticCurveTo = function(startPoint, controlPoint, endPoint) {
	this.ctx.moveTo(startPoint.x, startPoint.y);
	this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y,
			endPoint.x, endPoint.y);
}
Graphics.prototype.drawLine = function(a, b) {
	this.ctx.beginPath();
	this.ctx.moveTo(a.x, a.y);
	this.ctx.lineTo(b.x, b.y);
	this.ctx.stroke();
	this.ctx.closePath();
}
Graphics.prototype.drawPoint = function(p) {
	this.ctx.beginPath();
	this.ctx.moveTo(p.x, p.y);
	this.ctx.arc(p.x, p.y, this.getPen().getSize(),
			0, Graphics.CIRCLE_RADIAN,
			true);
	this.ctx.fill();
	this.ctx.closePath();
}
Graphics.prototype.drawText = function(literal, position) {
	position = position || Point2D.ORIGIN;
	this.ctx.beginPath();
	this.ctx.moveTo(position.x, position.y);
	this.ctx.fillText(literal, position.x, position.y);
	this.ctx.closePath();
}
Graphics.prototype.drawCurve = function(points, startIndex, endIndex, t) {
	var len = points.length;
	startIndex = startIndex || 0;
	endIndex = endIndex || len - 1;
	t = t || 0.5;
	if(endIndex - startIndex < 2)
		return;
	var controlPoints = new Array(endIndex - startIndex);

	var p0 = null, p1 = null, p2 = null;
	var d01 = 0.0, d12 = 0.0;
	var u = 0.0;
	var fa = 0.0, fb = 0.0;
	var v02 = new Point2D();
	for(var i = startIndex + 1; i < endIndex; ++i) {
		p0 = points[i - 1];
		p1 = points[i];
		p2 = points[i + 1];

		d01 = p1.distance(p0);
		d12 = p2.distance(p1);

		u = t / (d01 + d12);
		fa = u * d01;
		fb = u * d12;

		v02.assign(p2);
		v02.substraceSelf(p0);
		controlPoints[i] = [
				p1.substract(v02.scale(fa)),
				p1.add(v02.scale(fb))
				];
	}

	var cp1 = null, cp2 = null;

	this.ctx.beginPath();
	for(var i = startIndex + 1; i < endIndex - 1; ++i) {
		cp1 = controlPoints[i][1];
		cp2 = controlPoints[i + 1][0];
		this.bezierCurveTo(points[i], cp1, cp2, points[i + 1]);
	}
	//the first part
	this.quadraticCurveTo(points[startIndex], controlPoints[startIndex + 1][0], points[startIndex + 1]);
	//the last part
	this.quadraticCurveTo(points[endIndex - 1], controlPoints[endIndex - 1][1], points[endIndex]);
	this.ctx.stroke();
	this.ctx.closePath();
	for(var i = startIndex + 1; i < endIndex; ++i)
		controlPoints[i].length = 0;
	controlPoints.length = 0;
}
Graphics.prototype.drawLines = function(points, startIndex, endIndex) {
	var len = points.length;
	startIndex = startIndex || 0;
	endIndex = endIndex || len - 1;
	if(endIndex - startIndex < 1)
		return;
	this.ctx.beginPath();
	this.ctx.moveTo(points[startIndex].x, points[startIndex].y);
	for(var i = startIndex + 1; i <= endIndex; ++i)
		this.ctx.lineTo(points[i].x, points[i].y);
	this.ctx.stroke();
	this.ctx.closePath();
}
Graphics.prototype.drawPoints = function(points, startIndex, endIndex) {
	startIndex = startIndex || 0;
	endIndex = endIndex || points.length - 1;
	this.ctx.beginPath();
	for(var i = startIndex; i <= endIndex; ++i) {
		this.ctx.moveTo(points[i].x, points[i].y);
		this.ctx.arc(points[i].x, points[i].y, this.pen.size,
				0, Graphics.CIRCLE_RADIAN,
				true);
	}
	this.ctx.fill();
	this.ctx.closePath();
}
Graphics.prototype.drawImage = function(img, position) {
   	this.ctx.drawImage(img, position.x, position.y); 
}
Graphics.prototype.drawSlicedImage = function(img, sourceRect, destRect) {
	this.ctx.drawImage(img,
			sourceRect.leftTop.x, sourceRect.leftTop.y,
			sourceRect.width, sourceRect.height,
			destRect.leftTop.x, destRect.leftTop.y,
			destRect.width, destRect.height);
}
