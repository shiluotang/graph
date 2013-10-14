function Shape() { }
Shape.prototype = new RootObject();
Shape.prototype.draw = function() {}

function PrimitiveShape(penStyle) {
    this.penStyle = penStyle || new Pen();
}
PrimitiveShape.prototype = new Shape();
PrimitiveShape.prototype.penStyle = undefined;
PrimitiveShape.prototype.doDraw = function(graphics) {}
PrimitiveShape.prototype.draw = function(graphics) {
    var oldPen = graphics.getPen();
	graphics.setPen(this.penStyle);
	this.doDraw(graphics);
    graphics.setPen(oldPen);
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
	shapes = null;
	len = null;
}

function Canvas(graphics) {
	if(!!!graphics || !(graphics instanceof Graphics))
		throw new Error("argument exception \"graphics\"");
	this.graphics = graphics;
	this.shapes = new Array();
    var me = this;
    this.graphics.addEventListener(Graphics.MOUSE_DRAG_END_EVENT, function() { me.render(); });
    this.graphics.addEventListener(Graphics.MOUSE_WHEEL_EVENT, function() { me.render(); });
}

Canvas.prototype = new RootObject();
Canvas.prototype.graphics = undefined;
Canvas.prototype.shapes = undefined;
Canvas.prototype.addShape = function(shape) {
	if(!!shape && shape instanceof Shape)
		this.shapes.push(shape);
}
Canvas.prototype.removeShapes = function(shape) {
    //TODO: not implemented
    return this;
}
Canvas.prototype.render = function() {
    if(this.graphics === null || this.graphics === undefined)
        return;
    this.graphics.clear();
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

function Line(a, b, penStyle) {
    PrimitiveShape.call(this, penStyle);
    this.a = a || new Point2D();
    this.b = b || new Point2D();
}
Line.prototype = new PrimitiveShape();
Line.prototype.a = undefined;
Line.prototype.b = undefined;
Line.prototype.doDraw = function(graphics) {
    graphics.drawLine(this.a, this.b);
}

function LineChart(points, penStyle, startIndex, endIndex) {
    PrimitiveShape.call(this, penStyle);
    this.points = points || new Array();
    this.startIndex = startIndex || 0;
    this.endIndex = endIndex || this.points.length - 1;
}
LineChart.prototype = new PrimitiveShape();
LineChart.prototype.doDraw = function(graphics) {
    if(this.points.length <= this.startIndex)
        return;
    var point = null;
    graphics.begin();
    var point = this.points[this.startIndex];
    graphics.ctx.moveTo(point.x, point.y);
    for(var i = this.startIndex + 1; i <= this.endIndex; ++i) {
        if(point = this.points[i])
            graphics.ctx.lineTo(point.x, point.y);
    }
    graphics.ctx.stroke();
    graphics.end();
}

function Grids(wc, hc, penStyle) {
    PrimitiveShape.call(this, penStyle);
    this.wc = wc;
    this.hc = hc;
}
Grids.prototype = new PrimitiveShape();
Grids.prototype.doDraw = function(graphics) {
    var w = graphics.getWidth();
    var h = graphics.getHeight();

    var ratio = 0.0;
    var coeff = 0;
    var a = new Point2D();
    var b = new Point2D();

    coeff = 1 / (this.wc - 1);
    for(var i = 0; i < this.wc; ++i) {
        ratio = i * coeff;
        a.x = ratio * w;
        a.y = 0;
        b.x = a.x;
        b.y = h;
        graphics.drawLine(a, b);
    }
    coeff = 1 / (this.hc - 1);
    for(var i = 0; i < this.hc; ++i) {
        ratio = i * coeff;
        a.x = 0;
        a.y = ratio * h;
        b.x = w;
        b.y = a.y;
        graphics.drawLine(a, b);
    }
    //a.finalize();
    //b.finalize();
    a = null;
    b = null;
    coeff = null;
    ratio = null;
    h = null;
    w = null;
}

function AxesXY(literalX, literalY, literalOrigin, fontStyle, penStyle) {
	PrimitiveShape.call(this, penStyle);
	this.literalX = literalX || "X";
	this.literalY = literalY || "Y";
	this.literalOrigin = literalOrigin || "Origin(0, 0)";
	this.fontStyle = fontStyle || new FontStyle();
}
AxesXY.prototype = new PrimitiveShape();
AxesXY.prototype.doDraw = function(graphics) {
	var oldFont = graphics.ctx.font;
	graphics.ctx.font = this.fontStyle.toString();
	var SCALE = 0.8;
	var DELTA_H = 20;
	var DELTA_D = 5;
	var w = graphics.getWidth();
	var h = graphics.getHeight();
	var a = new Point2D();
	var b = new Point2D();
	var c = new Point2D();
	//X axis
	a.x = -SCALE * w;	a.y = 0;
	b.x = SCALE * w;	b.y = 0;
	graphics.drawLine(a, b);
	graphics.drawUpText(this.literalX, b);
	a.x = b.x - DELTA_H; a.y = DELTA_D;
	c.x = b.x - DELTA_H; c.y = -DELTA_D;
	graphics.fillPolygon([a, b, c]);

	//Y axis
	a.x = 0;	a.y = -SCALE * h;
	b.x = 0;	b.y = SCALE * h;
	graphics.drawLine(a, b);
	graphics.drawUpText(this.literalY, b);
	a.y = b.y - DELTA_H; a.x = -DELTA_D;
	c.y = b.y - DELTA_H; c.x = DELTA_D;
	graphics.fillPolygon([a, b, c]);
	graphics.drawUpText(this.literalOrigin, new Point2D(5, 5));
	graphics.ctx.font = oldFont;
}

function FontStyle(fontFamily, fontSize, fontStyle, fontVariant, fontWeight) {
    this.fontFamily = fontFamily || "sans-serif";
    this.fontSize = fontSize || "10px";
	this.fontStyle = fontStyle;
	this.fontVariant = fontVariant;
	this.fontWeight = fontWeight;
}
FontStyle.prototype = new RootObject();
FontStyle.prototype.fontFamily = undefined;
FontStyle.prototype.fontSize = undefined;
FontStyle.prototype.fontStyle = undefined;
FontStyle.prototype.fontVariant = undefined;
FontStyle.prototype.fontWeight = undefined;
FontStyle.prototype.presentation = undefined;

FontStyle.prototype.setFontFamily = function(fontFamily) {
	this.presentation = null;
	this.fontFamily = fontFamily;
}
FontStyle.prototype.setFontSize = function(fontSize) {
	this.presentation = null;
	this.fontSize = fontSize;
}
FontStyle.prototype.setFontStyle = function(fontStyle) {
	this.presentation = null;
	this.fontStyle = fontStyle;
}
FontStyle.prototype.setFontVariant = function(fontVariant) {
	this.presentation = null;
	this.fontVariant = fontVariant;
}
FontStyle.prototype.setFontWeight = function(fontWeight) {
	this.presentation = null;
	this.fontWeight = fontWeight;
}
FontStyle.prototype.getFontFamily = function() { return this.fontFamily; }
FontStyle.prototype.getFontSize = function() { return this.fontSize; }
FontStyle.prototype.getFontStyle = function() { return this.fontStyle; }
FontStyle.prototype.getFontVariant = function() { return this.fontVariant; }
FontStyle.prototype.getFontWeight = function() { return this.fontWeight; }
FontStyle.prototype.toString = function() {
	if(this.presentation === undefined || this.presentation === null) {
		var segments = new Array();
		if(this.fontStyle)
			segments.push(this.fontStyle);
		segments.push(this.fontSize);
		if(this.fontVariant)
			segments.push(this.fontVariant);
		if(this.fontWeight)
			segments.push(this.fontWeight);
		segments.push(this.fontFamily);
		this.presentation = segments.join(" ");
	}
	return this.presentation;
}

function Label(text, position, fontStyle, penStyle) {
	PrimitiveShape.call(this, penStyle);
    this.text = text;
    this.position = position || new Point2D();
    this.fontStyle = fontStyle || new FontStyle();
}
Label.prototype = new PrimitiveShape();
Label.prototype.doDraw = function(graphics) {
	var old = graphics.ctx.font;
    graphics.ctx.font = this.fontStyle.toString();
    graphics.drawUpText(this.text, this.position);
	graphics.ctx.font = old;
}
