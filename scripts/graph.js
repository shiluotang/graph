//-------------------------------------------------------------
// graphic engine
//-------------------------------------------------------------
function Color(red, green, blue, alpha) {
	this.red = red || 0;
	this.green = green || 0;
	this.blue = blue || 0;
	if(alpha === undefined || alpha === null)
		this.alpha = 1;
	else
		this.alpha = alpha;
	if(this.red < 1 && this.red > 0)
		this.red = this.red * 255;
	if(this.green < 1 && this.green > 0)
		this.green = this.green * 255;
	if(this.blue < 1 && this.blue > 0)
		this.blue = this.blue * 255;
}
Color.prototype = new RootObject();
Color.prototype.red = undefined;
Color.prototype.green = undefined;
Color.prototype.blue = undefined;
Color.prototype.alpha = undefined;

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
Color.fromRGB = function(r, g, b) { return new Color(r, g, b); }
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
Pen.prototype.color = undefined;
Pen.prototype.size = undefined;

Pen.prototype.getColor = function() { return this.color; }
Pen.prototype.getSize = function() { return this.size; }

function Point2D(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}
Point2D.prototype = new RootObject();
Point2D.prototype.x = undefined;
Point2D.prototype.y = undefined;

Point2D.prototype.assign = function(other) {
	this.x = other.x;
	this.y = other.y;
	return this;
}
Point2D.prototype.getX = function() { return this.x; }
Point2D.prototype.getY = function() { return this.y; }
Point2D.prototype.setX = function(x) { this.x = x; return this; }
Point2D.prototype.setY = function(y) { this.y = y; return this; }
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
Point2D.prototype.substractSelf = function(other) {
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
/**
 * m00	m01	m02			m00	m01	dx
 * m10	m11	m12		=	m10	m11	dy
 * m20	m21	m22			0	0	1
 */
function TransformMatrix() {
	this.setIdentity();
}
TransformMatrix.assign = function(a, c) {
	c.m00 = a.m00; c.m01 = a.m01; c.m02 = a.m02;
	c.m10 = a.m10; c.m11 = a.m11; c.m12 = a.m12;
	c.m20 = a.m20; c.m21 = a.m21; c.m22 = a.m22;
}
TransformMatrix.multiply = function(a, b, c) {
	c.m00 = a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20;
	c.m01 = a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21;
	c.m02 = a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22;

	c.m10 = a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20;
	c.m11 = a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21;
	c.m12 = a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22;

	c.m20 = a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20;
	c.m21 = a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21;
	c.m22 = a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22;
}
TransformMatrix.inverse = function(a, c) {
	c.m00 = a.m11 * a.m22 - a.m12 * a.m21;
	c.m10 = a.m12 * a.m20 - a.m10 * a.m22;
	c.m20 = a.m10 * a.m21 - a.m11 * a.m20;

	c.m01 = a.m02 * a.m21 - a.m01 * a.m22;
	c.m11 = a.m00 * a.m22 - a.m02 * a.m20;
	c.m21 = a.m01 * a.m20 - a.m00 * a.m21;

	c.m02 = a.m01 * a.m12 - a.m02 * a.m11;
	c.m12 = a.m02 * a.m10 - a.m00 * a.m12;
	c.m22 = a.m00 * a.m11 - a.m01 * a.m10;
	var detA = a.m00 * c.m00 + a.m01 * c.m10 + a.m02 * c.m20;
	if(detA === 0)
		throw new Error("can't get inverse");
	var coeff = 1.0 / detA;
	c.m00 *= coeff;
	c.m01 *= coeff;
	c.m02 *= coeff;

	c.m10 *= coeff;
	c.m11 *= coeff;
	c.m12 *= coeff;

	c.m20 *= coeff;
	c.m21 *= coeff;
	c.m22 *= coeff;
}

TransformMatrix.prototype = new RootObject();
TransformMatrix.prototype.m00 = undefined;
TransformMatrix.prototype.m01 = undefined;
TransformMatrix.prototype.m02 = undefined;
TransformMatrix.prototype.m10 = undefined;
TransformMatrix.prototype.m11 = undefined;
TransformMatrix.prototype.m12 = undefined;
TransformMatrix.prototype.m20 = undefined;
TransformMatrix.prototype.m21 = undefined;
TransformMatrix.prototype.m22 = undefined;

TransformMatrix.prototype.assign = function(other) {
	TransformMatrix.assign(other, this);
	return this;
}
TransformMatrix.prototype.multiply = function(other) {
	var c = new TransformMatrix();
	TransformMatrix.multiply(this, other, c);
	return c;
}
TransformMatrix.prototype.setIdentity = function() {
	this.m00 = 1; this.m01 = 0; this.m02 = 0;
	this.m10 = 0; this.m11 = 1; this.m12 = 0;
	this.m20 = 0; this.m21 = 0; this.m22 = 1;
}
TransformMatrix.prototype.rotate = function(radian) {
	var cosine = Math.cos(radian);
	var sine = Math.sin(radian);
	var other = new TransformMatrix();
	other.m00 = cosine; other.m01 = -sine;
	other.m10 = sine; other.m11 = cosine;
	var c = new TransformMatrix();
	TransformMatrix.multiply(this, other, c);
	return c;
}
TransformMatrix.prototype.translate = function(dx, dy) {
	var other = new TransformMatrix();
	other.m02 = dx;
	other.m12 = dy;
	var c = new TransformMatrix();
	TransformMatrix.multiply(this, other, c);
	return c;
}
TransformMatrix.prototype.scale = function(sx, sy) {
	var other = new TransformMatrix();
	other.m00 = sx || 1;
	other.m11 = sy || 1;
	var c = new TransformMatrix();
	TransformMatrix.multiply(this, other, c);
	return c;
}
TransformMatrix.prototype.transform = function(src, dest) {
	dest.x = this.m00 * src.x + this.m01 * src.y + this.m02;
	dest.y = this.m10 * src.x + this.m11 * src.y + this.m12;
	return dest;
}
TransformMatrix.prototype.inverse = function() {
	var c = new TransformMatrix();
	TransformMatrix.inverse(this, c);
	return c;
}

function Graphics(ctx, pen) {
	this.ctx = ctx;
	pen = pen || new Pen();
	this.setPen(pen);
	this.transformMatrix = new TransformMatrix();
	this.matrixStack = new Array(0);
}
Graphics.prototype = new RootObject();
Graphics.CIRCLE_RADIAN = Math.PI * 2;

//fields
Graphics.prototype.ctx = undefined;
Graphics.prototype.pen = undefined;
Graphics.prototype.transformMatrix = undefined;
Graphics.prototype.matrixStack = undefined;

//methods
Graphics.prototype.getWidth = function() { return this.ctx.canvas.width; }
Graphics.prototype.getHeight = function() { return this.ctx.canvas.height; }
Graphics.prototype.setWidth = function(width) { this.ctx.canvas.width = width; }
Graphics.prototype.setHeight = function(height) { this.ctx.canvas.height = height; }

Graphics.prototype.getPen = function() { return this.pen; }
Graphics.prototype.setPen = function(pen) {
	this.pen = pen;
	this.ctx.fillStyle = pen.color.toString();
	this.ctx.strokeStyle = pen.color.toString();
	this.ctx.lineWidth = pen.size;
}
Graphics.prototype.save = function() {
	this.matrixStack.push(this.transformMatrix);
	this.ctx.save();
}
Graphics.prototype.restore = function() {
	var m = this.matrixStack.shift();
	if(m !== undefined && m !== null)
		this.transformMatrix = m;
	this.ctx.restore();
}
Graphics.prototype.getCurrentTransformMatrix = function() {
	return this.transformMatrix;
}
/**
 * m11	m12	dx
 * m21	m22 dy
 * 0	0	1
 */
Graphics.prototype.setTransformFromMatrix = function() {
	var m = this.transformMatrix;
	this.ctx.setTransform(m.m00, m.m10, m.m01, m.m11, m.m02, m.m12);
}
Graphics.prototype.clearTransform = function() {
	this.transformMatrix.setIdentity();
	this.setTransformFromMatrix();
}
Graphics.prototype.translate = function(dx, dy) {
	this.transformMatrix.assign(this.transformMatrix.translate(dx, dy));
	this.setTransformFromMatrix();
	return this;
}
Graphics.prototype.rotate = function(radian) {
	this.transformMatrix.assign(this.transformMatrix.rotate(radian));
	this.setTransformFromMatrix();
	return this;
}
Graphics.prototype.scale = function(sx, sy) {
	this.transformMatrix.assign(this.transformMatrix.scale(sx, sy));
	this.setTransformFromMatrix();
	return this;
}

Graphics.prototype.clear = function() {
	this.ctx.save();
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
	this.ctx.restore();
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
	this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
}
Graphics.prototype.drawLine = function(a, b) {
	this.ctx.beginPath();
	this.ctx.moveTo(a.x, a.y);
	this.ctx.lineTo(b.x, b.y);
	this.ctx.stroke();
	this.ctx.closePath();
}
Graphics.prototype.fillPolygon = function(points, startIndex, endIndex) {
	var len = points.length;
	startIndex = startIndex || 0;
	endIndex = endIndex || len - 1;
	if(endIndex - startIndex < 2)
		return;
	console.log(points);
	var p = points[startIndex];
	this.ctx.moveTo(p.x, p.y);
	for(var i = startIndex + 1; i <= endIndex; ++i) {
		p = points[i];
		this.ctx.lineTo(p.x, p.y);
	}
	this.transform(points[startIndex], p);
	this.ctx.lineTo(p.x, p.y);
	this.ctx.fill();
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
Graphics.prototype.drawUpText = function(literal, position) {
	position = position || Point2D.ORIGIN;
	this.ctx.save();
	this.ctx.translate(position.x, position.y);
	this.ctx.scale(1, -1);
	this.ctx.fillText(literal, 0, 0);
	this.ctx.restore();
}
Graphics.prototype.drawViewUpText = function(literal, position) {
	position = position || Point2D.ORIGIN;
	var p = new Point2D();
	var m = new TransformMatrix();
	m.assign(this.transformMatrix);
	this.clearTransform();
	m.transform(position, p);
	this.ctx.beginPath();
	if(!isNaN(p.x) && !isNaN(p.y)) {
		this.ctx.moveTo(p.x, p.y);
		this.ctx.fillText(literal, p.x, p.y);
	}
	this.ctx.closePath();
	this.transformMatrix.assign(m);
	this.setTransformFromMatrix();
	m = null;
}
Graphics.prototype.drawText = function(literal, position) {
	position = position || Point2D.ORIGIN;
	this.ctx.beginPath();
	this.ctx.fillText(literal, position.x, position.y);
	this.ctx.closePath();
}
Graphics.prototype.fillPolygon = function(points, startIndex, endIndex) {
	var len = points.length;
	startIndex = startIndex || 0;
	endIndex = endIndex || len - 1;
	if(endIndex - startIndex < 2)
		return;
	var p = points[startIndex];
	this.ctx.moveTo(p.x, p.y);
	for(var i = startIndex + 1; i <= endIndex; ++i) {
		p = points[i];
		this.ctx.lineTo(p.x, p.y);
	}
	p = points[startIndex];
	this.ctx.lineTo(p.x, p.y);
	this.ctx.fill();
	this.ctx.closePath();
}
Graphics.prototype.drawPolygon = function(points, startIndex, endIndex) {
	var len = points.length;
	startIndex = startIndex || 0;
	endIndex = endIndex || len - 1;
	if(endIndex - startIndex < 2)
		return;
	var p = points[startIndex];
	this.ctx.moveTo(p.x, p.y);
	for(var i = startIndex + 1; i <= endIndex; ++i) {
		p = points[i];
		this.ctx.lineTo(p.x, p.y);
	}
	p = points[startIndex];
	this.ctx.lineTo(p.x, p.y);
	this.ctx.stroke();
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
		v02.substractSelf(p0);
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
	var p = new Point2D();
	this.ctx.beginPath();
	var p = points[startIndex];
	this.ctx.moveTo(p.x, p.y);
	for(var i = startIndex + 1; i <= endIndex; ++i) {
		p = points[i];
		this.ctx.lineTo(p.x, p.y);
	}
	this.ctx.stroke();
	this.ctx.closePath();
}
Graphics.prototype.drawPoints = function(points, startIndex, endIndex) {
	var p = null;
	startIndex = startIndex || 0;
	endIndex = endIndex || points.length - 1;
	this.ctx.beginPath();
	for(var i = startIndex; i <= endIndex; ++i) {
		p = points[i];
		this.ctx.moveTo(p.x, p.y);
		this.ctx.arc(p.x, p.y, this.getPen().getSize(),
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
