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

function Graph(ctx, pen) {
	this.ctx = ctx;
	pen = pen || new Pen();
	this.setPen(pen);
}
Graph.prototype = new RootObject();
Graph.CIRCLE_RADIAN = Math.PI * 2;

Graph.prototype.getWidth = function() { return this.ctx.canvas.width; }
Graph.prototype.getHeight = function() { return this.ctx.canvas.height; }
Graph.prototype.setWidth = function(width) {
   	this.ctx.canvas.width = width; 
}
Graph.prototype.setHeight = function(height) {
   	this.ctx.canvas.height = height; 
}
Graph.prototype.getPen = function() { return this.pen; }
Graph.prototype.setPen = function(pen) {
	this.pen = pen;
	this.ctx.fillStyle = pen.color.toString();
	this.ctx.strokeStyle = pen.color.toString();
	this.ctx.lineWidth = pen.size;
}
Graph.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
}
Graph.prototype.clearRect = function(rect) {
	this.ctx.clearRect(rect.leftTop.x, rect.leftTop.y,
			rect.width, rect.height);
}
Graph.prototype.begin = function() { this.ctx.beginPath(); }
Graph.prototype.end = function() { this.ctx.closePath(); }
Graph.prototype.lineTo = function(p1, p2) {
	this.ctx.moveTo(p1.x, p1.y);
	this.ctx.lineTo(p2.x, p2.y);
}
Graph.prototype.bezierCurveTo = function(startPoint,
		controlPoint1,
		controlPoint2,
		endPoint) {
	this.ctx.moveTo(startPoint.x, startPoint.y);
	this.ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y,
			controlPoint2.x, controlPoint2.y,
			endPoint.x, endPoint.y);
}
Graph.prototype.quadraticCurveTo = function(startPoint, controlPoint, endPoint) {
	this.ctx.moveTo(startPoint.x, startPoint.y);
	this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y,
			endPoint.x, endPoint.y);
}
Graph.prototype.drawLine = function(a, b) {
	this.ctx.beginPath();
	this.ctx.moveTo(a.x, a.y);
	this.ctx.lineTo(b.x, b.y);
	this.ctx.stroke();
	this.ctx.closePath();
}
Graph.prototype.drawPoint = function(p) {
	this.ctx.beginPath();
	this.ctx.moveTo(p.x, p.y);
	this.ctx.arc(p.x, p.y, this.getPen().getSize(),
			0, Graph.CIRCLE_RADIAN,
			true);
	this.ctx.fill();
	this.ctx.closePath();
}
Graph.prototype.drawText = function(literal, position) {
	position = position || Point2D.ORIGIN;
	this.ctx.beginPath();
	this.ctx.moveTo(position.x, position.y);
	this.ctx.fillText(literal, position.x, position.y);
	this.ctx.closePath();
}
Graph.prototype.drawCurve = function(points, t) {
	t = t || 0.5;

	var len = points.length;
	var controlPoints = new Array(len);

	var p0 = null, p1 = null, p2 = null;
	var d01 = 0.0, d12 = 0.0;
	var u = 0.0;
	var fa = 0.0, fb = 0.0;
	var v02 = new Point2D();
	for(var i = 1; i < len - 1; ++i) {
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
	for(var i = 1; i < len - 2; ++i) {
		cp1 = controlPoints[i][1];
		cp2 = controlPoints[i + 1][0];
		this.bezierCurveTo(points[i], cp1, cp2, points[i + 1]);
	}
	//the first part
	this.quadraticCurveTo(points[0], controlPoints[1][0], points[1]);
	//the last part
	this.quadraticCurveTo(points[len - 2], controlPoints[len - 2][1], points[len - 1]);
	this.ctx.stroke();
	this.ctx.closePath();
	for(var i = 1; i < len - 1; ++i)
		controlPoints[i].length = 0;
	controlPoints.length = 0;
}
Graph.prototype.drawPlotted = function(points) {
	var len = points.length;
	this.ctx.beginPath();
	this.ctx.moveTo(points[0].x, points[0].y);
	for(var i = 1; i < len; ++i)
		this.ctx.lineTo(points[i].x, points[i].y);
	this.ctx.stroke();
	this.ctx.closePath();
}
Graph.prototype.drawPoints = function(points, startIndex, endIndex) {
	startIndex = startIndex || 0;
	endIndex = endIndex || points.length - 1;
	this.ctx.beginPath();
	for(var i = startIndex; i <= endIndex; ++i) {
		this.ctx.moveTo(points[i].x, points[i].y);
		this.ctx.arc(points[i].x, points[i].y, this.pen.size,
				0, Graph.CIRCLE_RADIAN,
				true);
	}
	this.ctx.fill();
	this.ctx.closePath();
}
Graph.prototype.drawImage = function(img, position) {
   	this.ctx.drawImage(img, position.x, position.y); 
}
Graph.prototype.drawSlicedImage = function(img, sourceRect, destRect) {
	this.ctx.drawImage(img,
			sourceRect.leftTop.x, sourceRect.leftTop.y,
			sourceRect.width, sourceRect.height,
			destRect.leftTop.x, destRect.leftTop.y,
			destRect.width, destRect.height);
}
