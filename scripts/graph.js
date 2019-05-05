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
 * m00  m01 m02         m00 m01 dx
 * m10  m11 m12     =   m10 m11 dy
 * m20  m21 m22         0   0   1
 */
function TransformMatrix() { }
TransformMatrix.prototype = new Matrix3().setIdentity();
TransformMatrix.prototype.translate = function(dx, dy) {
    var b = new TransformMatrix();
    b.m02 = dx;
    b.m12 = dy;
    return this.multiply(b);
}
TransformMatrix.prototype.rotate = function(radian) {
    var b = new TransformMatrix();
    var cosine = Math.cos(radian);
    var sine = Math.sin(radian);
    b.m00 = cosine; b.m01 = -sine;
    b.m10 = sine; b.m11 = cosine;
    return this.multiply(b);
}
TransformMatrix.prototype.scale = function(sx, sy) {
    var b = new TransformMatrix();
    b.m00 = sx || 1;
    b.m11 = sy || 1;
    return this.multiply(b);
}

function Graphics(domNode, pen) {
    if(domNode === undefined || domNode === null)
        throw new Error("no DOM node specified.");
    if(domNode.getContext) {
        try {
            this.ctx = domNode.getContext("2d");
        } catch(e) {
        }
    }
    if(this.ctx === undefined || this.ctx === null)
        throw new Error("HTML5 canvas api not supported!");
    this.domNode = domNode;
    pen = pen || new Pen();
    this.setPen(pen);
    this.transformMatrix = new TransformMatrix();
    this.matrixStack = new Array(0);

    var eventTableMaxIndex = -1;
    for(var propName in Graphics) {
        if(propName === undefined || propName === null)
            return;
        if(propName.startsWith("MOUSE_") && propName.endsWith("_EVENT"))
            if(eventTableMaxIndex < Graphics[propName])
                eventTableMaxIndex = Graphics[propName];
    }
    this.eventTable = new Array(eventTableMaxIndex === -1 ? 0 : eventTableMaxIndex + 1);
    for(var i = 0; i < this.eventTable.length; ++i)
        this.eventTable[i] = new Array(0);
    this.addEventListener(Graphics.MOUSE_WHEEL_EVENT, Graphics.mouseWheelHandler);
    this.addEventListener(Graphics.MOUSE_DRAG_EVENT, Graphics.mouseDraggingHandler);
    this.enableMouseControl();
}
Graphics.prototype = new RootObject();
Graphics.CIRCLE_RADIAN = Math.PI * 2;

//event table indexes. make sure constants
//start with "MOUSE_" prefix and end with
//"_EVENT" suffix
Graphics.MOUSE_WHEEL_EVENT = 0;
Graphics.MOUSE_DRAG_EVENT = 1;
Graphics.MOUSE_DRAG_START_EVENT = 2;
Graphics.MOUSE_DRAG_END_EVENT = 3;
Graphics.MOUSE_UP_EVENT = 4;
Graphics.MOUSE_DOWN_EVENT = 5;
Graphics.MOUSE_CLICK_EVENT = 6;

//fields
Graphics.prototype.ctx = undefined;
Graphics.prototype.pen = undefined;
Graphics.prototype.transformMatrix = undefined;
Graphics.prototype.matrixStack = undefined;
Graphics.prototype.dragData = {
    isDragging : false,
    startClientX : 0, startClientY : 0,
    currentClientX : 0, currentClientY : 0,
    movementX : 0, movementY : 0,
    lastClientX: 0, lastClientY: 0,
    totalMovementX : 0, totalMovementY : 0
};

//listeners
Graphics.prototype.addEventListener = function(eventType, callback) {
    var oldCallbacks = this.eventTable[eventType];
    var newCallbacks = new Array(oldCallbacks.length);
    for(var i = 0; i < oldCallbacks.length; ++i)
        newCallbacks[i] = oldCallbacks[i];
    newCallbacks.push(callback);
    this.eventTable[eventType] = newCallbacks;
}
Graphics.prototype.removeEventListener = function(eventType, callback) {
    var oldCallbacks = this.eventTable[eventType];
    var newCallbacks = new Array(oldCallbacks.length);
    var removeIndex = -1;
    for(var i = 0; i < oldCallbacks.length; ++i) {
        if(newCallbacks[i] === callback) {
            removeIndex = i;
            break;
        }
    }
    if(removeIndex !== -1)
        newCallbacks.splice(removeIndex, 1);
    this.eventTable[eventType] = newCallbacks;
}
Graphics.prototype.triggerEvent = function(eventType) {
    var callbacks = this.eventTable[eventType];
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < callbacks.length; ++i)
        callbacks[i].apply(null, args);
}
Graphics.prototype.enableMouseControl = function() {
    var me = this;
    if(this.domNode !== undefined && this.domNode !== null) {
        HtmlDom.addEventListener(this.domNode, "mousemove", function(e) { me.mouseMoveHandler(e) });
        HtmlDom.addEventListener(this.domNode, "mousedown", function(e) { me.mouseDownHandler(e) });
        HtmlDom.addEventListener(this.domNode, "mouseup", function(e) { me.mouseUpHandler(e) });
        HtmlDom.addEventListener(this.domNode, "click", function(e) { me.mouseClickHandler(e) });
        HtmlDom.addEventListener(this.domNode, "mousewheel", function(e) { me.mouseWheelHandler(e) });
    }
}
Graphics.prototype.mouseWheelHandler = function(e) {
    e = e || window.event;
    var delta = 0;
    if(e.wheelDelta !== undefined && e.wheelDelta !== null)
        delta = e.wheelDelta / 120;
    else if(e.detail !== undefined && e.detail !== null)
        delta = -e.detail / 3;
    else
        return true;
    console.log("mouse wheel event: delta = " + delta);
    if(delta === 0)
        return true;
    this.triggerEvent(Graphics.MOUSE_WHEEL_EVENT, this, e, delta);
    if(e.preventDefault)
        e.preventDefault();
    else
        return false;
}
Graphics.prototype.mouseUpHandler = function(e) {
    if(!this.dragData.isDragging)
        return;
    e = e || window.event;
    this.dragData.isDragging = false;
    this.domNode.style["cursor"] = "default";
    console.log("mouse drag-end event");
    this.triggerEvent(Graphics.MOUSE_DRAG_END_EVENT, this, e);
}
Graphics.prototype.mouseDownHandler = function(e) {
    e = e || window.event;

    this.dragData.startClientX = e.clientX;
    this.dragData.startClientY = e.clientY;

    this.dragData.currentClientX = this.dragData.startClientX;
    this.dragData.currentClientY = this.dragData.startClientY;

    this.dragData.lastClientX = this.dragData.startClientX;
    this.dragData.lastClientY = this.dragData.startClientY;

    this.dragData.movementX = 0;
    this.dragData.movementY = 0;

    this.dragData.totalMovementX = 0;
    this.dragData.totalMovementY = 0;

    this.dragData.isDragging = true;
    this.domNode.style["cursor"] = "move";
    this.triggerEvent(Graphics.MOUSE_DOWN_EVENT, this, e);
}
Graphics.prototype.mouseClickHandler = function(e) {
    e = e || window.event;
    console.log("mouse click event");
    this.triggerEvent(Graphics.MOUSE_CLICK_EVENT, this, e);
}
Graphics.prototype.mouseMoveHandler = function(e) {
    if(!this.dragData.isDragging)
        return;
    e = e || window.event;
    this.dragData.currentClientX = e.clientX;
    this.dragData.currentClientY = e.clientY;
    console.log("lastClientX = " + this.dragData.lastClientX);
    console.log("lastClientY = " + this.dragData.lastClientY);
    console.log("currentClientX = " + this.dragData.currentClientX);
    console.log("currentClientY = " + this.dragData.currentClientY);
    this.dragData.movementX = this.dragData.currentClientX - this.dragData.lastClientX;
    this.dragData.movementY = this.dragData.currentClientY - this.dragData.lastClientY;
    this.dragData.totalMovementX = this.dragData.currentClientX - this.dragData.startClientX;
    this.dragData.totalMovementY = this.dragData.currentClientY - this.dragData.startClientY;

    // update before translate.
    this.dragData.lastClientX = this.dragData.currentClientX;
    this.dragData.lastClientY = this.dragData.currentClientY;

    console.log("movementX = " + this.dragData.movementX);
    console.log("movementY = " + this.dragData.movementY);
    console.log("totalMovementX = " + this.dragData.totalMovementX);
    console.log("totalMovementY = " + this.dragData.totalMovementY);
    console.log("mouse drag event");
    this.triggerEvent(Graphics.MOUSE_DRAG_EVENT, this, e);
}
Graphics.mouseWheelHandler = function(graphics, e, delta) {
    var rect = graphics.domNode.getBoundingClientRect();
    var src = new Point2D();
    src.x = e.clientX - rect.left;
    src.y = e.clientY - rect.top;
    if(delta === 0)
        return;
    var scaling = delta < 0 ? 1.09 : 1.0 / 1.09;
    var dest = new Point2D();
    graphics.getCurrentTransformMatrix().inverse().transform(src, dest);
    graphics.translate(dest.x, dest.y);
    graphics.scale(scaling, scaling);
    graphics.scale(scaling, scaling);
    graphics.translate(-dest.x, -dest.y);
}
Graphics.mouseDragEndHandler = function(graphics, e) {
    var deltaX = graphics.dragData.totalMovementX;
    var deltaY = graphics.dragData.totalMovementY;
    var destVector = new Point2D();
    var m = graphics.transformMatrix;
    var abs_cosine = Math.sqrt(Math.abs(m.m00 * m.m11 / (m.m00 * m.m11 - m.m01 * m.m10)));
    var abs_scaleX = Math.abs(m.m00 / abs_cosine);
    var abs_scaleY = Math.abs(m.m11 / abs_cosine);
    destVector.setX((m.m00 * deltaX + m.m01 * deltaY) / abs_scaleX / abs_scaleX);
    destVector.setY((m.m10 * deltaX + m.m11 * deltaY) / abs_scaleY / abs_scaleY);
    graphics.translate(destVector.getX(), destVector.getY());
}
Graphics.mouseDraggingHandler  = function(graphics, e) {
    var deltaX = graphics.dragData.movementX;
    var deltaY = graphics.dragData.movementY;
    var destVector = new Point2D();
    var m = graphics.transformMatrix;
    var abs_cosine = Math.sqrt(Math.abs(m.m00 * m.m11 / (m.m00 * m.m11 - m.m01 * m.m10)));
    var abs_scaleX = Math.abs(m.m00 / abs_cosine);
    var abs_scaleY = Math.abs(m.m11 / abs_cosine);
    destVector.setX((m.m00 * deltaX + m.m01 * deltaY) / abs_scaleX / abs_scaleX);
    destVector.setY((m.m10 * deltaX + m.m11 * deltaY) / abs_scaleY / abs_scaleY);
    graphics.translate(destVector.getX(), destVector.getY());
}

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
 * m11  m12 dx
 * m21  m22 dy
 * 0    0   1
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
    p = points[startIndex];
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
