function Shape() { }
Shape.prototype = new RootObject();
Shape.prototype.draw = function() {}

function PrimitiveShape() {}
PrimitiveShape.prototype = new Shape();
PrimitiveShape.prototype.penStyle = undefined;
PrimitiveShape.prototype.doDraw = function() {}
PrimitiveShape.prototype.draw = function(graphics) {
	graphics.setPen(this.penStyle);
	this.doDraw(graphics);
}

function CompositeShape() { this.shapes = new Array(); }
CompositeShape.prototype = new Shape();
CompositeShape.prototype.shapes = undefined;
CompositeShape.prototype.addShape = function(shape) {
	if(!!shape && shape instanceof Shape)
		this.shapes.push(shape);
}
CompositeShape.prototype.draw = function(graphics) {
	var shapes = this.shapes;
	var len = shapes.length;
	var shape = null;
	for(var i = 0; i < len; ++i)
		if(shape = shapes[i])
			shape.draw(graphics);
	shape = null;
	len = null;
	shapes = null;
}

function Canvas(graphics) {
	if(!!!graphics || !(graphics instanceof Graphics))
		throw new Error("argument exception \"graphics\"");
	this.graphics = graphics;
	this.shapes = new Array();
}

Canvas.prototype = new RootObject();
Canvas.prototype.shapes = undefined;
Canvas.prototype.addShape = function(shape) {
	if(!!shape && shape instanceof Shape)
		this.shapes.push(shape);
}
Canvas.prototype.render = function() {
	var shapes = this.shapes;
	var len = shapes.length;
	var shape = null;
	for(var i = 0; i < len; ++i)
		if(shape = shapes[i])
			shape.draw(this.graphics);
	shape = null;
	len = null;
	shapes = null;
}

function Point() {}
function Line() {}
function Arc() {}
function Polygon() {}
function Curve() {}
function Label() {}

function Grids() {}
