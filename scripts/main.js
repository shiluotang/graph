function get2DContext(nodeOrId) {
	var node = HtmlDom.$(nodeOrId);
	var ctx = null;
	if(node.getContext) try {
		ctx = node.getContext("2d");
	} catch(e) {
	}
	if(ctx === null)
		throw new Error("can NOT get 2d context from " + nodeOrId);
	return ctx;
}

function Rotating(graphics) {
	this.graphics = graphics;
	this.theta = 0;
	this.delta = Math.PI / 2 / 600;
}
Rotating.prototype = new Runnable();
Rotating.prototype.isFinished = function() { return this.theta >= Math.PI / 2; }
Rotating.prototype.doRun = function() {
	this.theta += this.delta;
	var g = this.graphics;
	var w = g.getWidth();
	var h = g.getHeight();
	var observer = new Observer();
	observer.moveTo(new Vector3(200, 200, 200));
	observer.rotateX(-Math.PI / 4);
	observer.rotateY(this.theta);
	//observer.rotateZ(Math.PI / 7);
	//observer.rotateX(Math.PI / 8);
	var origin = observer.get2DPosition(new Vector3(0, 0, 0));
	var xAxis = observer.get2DPosition(new Vector3(100, 0, 0));
	var yAxis = observer.get2DPosition(new Vector3(0, 100, 0));
	var zAxis = observer.get2DPosition(new Vector3(0, 0, 100));

	var p1 = observer.get2DPosition(new Vector3(0, 60, 50));
	var p2 = observer.get2DPosition(new Vector3(70, 60, 50));
	var p3 = observer.get2DPosition(new Vector3(70, 60, 0));
	var p4 = observer.get2DPosition(new Vector3(0, 60, 0));

	var p5 = observer.get2DPosition(new Vector3(0, 0, 50));
	var p6 = observer.get2DPosition(new Vector3(70, 0, 50));
	var p7 = observer.get2DPosition(new Vector3(70, 0, 0));
	var p8 = observer.get2DPosition(new Vector3(0, 0, 0));

	g.clear();
	g.setPen(new Pen(Color.RED));
	g.drawLine(origin, xAxis);
	g.drawLine(origin, yAxis);
	g.drawLine(origin, zAxis);
	g.drawUpText("X", xAxis);
	g.drawUpText("Y", yAxis);
	g.drawUpText("Z", zAxis);
	g.setPen(new Pen(Color.BLACK));

	g.drawLine(p1, p2);
	g.drawLine(p2, p3);
	g.drawLine(p3, p4);
	g.drawLine(p4, p1);
	g.drawLine(p5, p6);
	g.drawLine(p6, p7);
	//g.drawLine(p7, p8);
	//g.drawLine(p8, p5);

	g.drawLine(p1, p5);
	g.drawLine(p2, p6);
	g.drawLine(p3, p7);
	//g.drawLine(p4, p8);

}

function test1() {
	var graphics;
	var isDragging = false;
	function mouseMoveListener(e) {
		if(isDragging) {
			var deltaX = e.mozMovementX;
			var deltaY = e.mozMovementY;
			var destVector = new Point2D();
			var m = graphics.transformMatrix;
			destVector.setX(m.m00 * deltaX + m.m01 * deltaY);
			destVector.setY(m.m10 * deltaX + m.m11 * deltaY);
			console.log(destVector);
			graphics.translate(destVector.getX(), destVector.getY());
			graphics.clear();
		}
	}
	function mouseDownListener(e) { isDragging = true; }
	function mouseUpListener(e) { isDragging = false; }
	graphics = new Graphics(get2DContext("canvas_node"));
	
	graphics.translate(graphics.getWidth() / 2, graphics.getHeight() / 2);
	graphics.scale(1, -1);
	var rotating = new Rotating(graphics);
	var timer = new AnimationTimer(rotating);
	timer.start();
	var canvasDomNode = document.getElementById("canvas_node");
	canvasDomNode.addEventListener("mousemove", mouseMoveListener, false);
	canvasDomNode.addEventListener("mousedown", mouseDownListener, false);
	canvasDomNode.addEventListener("mouseup", mouseUpListener, false);
}

function test2() {
	var graphics;
	var isDragging = false;
	function mouseWheelListener(e) {
		var eventTarget = e.target || e.srcElement;
		var rect = eventTarget.getBoundingClientRect();
		var src = new Point2D();
		src.x = e.clientX - rect.left;
		src.y = e.clientY - rect.top;
		console.log(src);
		if(e.detail === 0)
			return;
		var scaling = e.detail < 0 ? 1.09 : 0.81;
		var dest = new Point2D();
		graphics.getCurrentTransformMatrix().inverse().transform(src, dest);
		console.log(dest);
		graphics.translate(dest.x, dest.y);
		graphics.scale(scaling, scaling);
		graphics.translate(-dest.x, -dest.y);
		graphics.clear();
		drawAxes();
	}
	function mouseMoveListener(e) {
		if(isDragging) {
			var deltaX = e.mozMovementX;
			var deltaY = e.mozMovementY;
			var destVector = new Point2D();
			var m = graphics.transformMatrix;
			console.log("deltaX: " + deltaX + ", deltaY: " + deltaY);
			var abs_cosine = Math.sqrt(Math.abs(m.m00 * m.m11 / (m.m00 * m.m11 - m.m01 * m.m10)));
			var abs_scaleX = Math.abs(m.m00 / abs_cosine);
			var abs_scaleY = Math.abs(m.m11 / abs_cosine);
			console.log("scaleX: " + abs_scaleX + ", scaleY: " + abs_scaleY);
			destVector.setX((m.m00 * deltaX + m.m01 * deltaY) / abs_scaleX / abs_scaleX);
			destVector.setY((m.m10 * deltaX + m.m11 * deltaY) / abs_scaleY / abs_scaleY);
			console.log(destVector);
			console.log(m);
			graphics.translate(destVector.getX(), destVector.getY());
			graphics.clear();
			drawAxes();
		}
	}
	/**
	 * 1. pageX, pageY
	 * 2. screenX, screenY
	 * 3. mozMovementX mozMovementY
	 * 4. clientX, clientY
	 * 5. layerX, layerY
	 * 1 == 4 == 5
	 * if there're scollings then
	 * 1 == 5 == 4 + scollings (scollTop or scrollLeft)
	 */
	function mouseDownListener(e) {
		var eventTarget = e.target || e.srcElement;
		var rect = eventTarget.getBoundingClientRect();
		var x = e.clientX - rect.left;
		var y = e.clientY - rect.top;
		isDragging = true;
	}
	function mouseUpListener(e) {
		var eventTarget = e.target || e.srcElement;
		var rect = eventTarget.getBoundingClientRect();
		var x = e.clientX - rect.left;
		var y = e.clientY - rect.top;
		isDragging = false;
	}
	function drawAxes() {
		graphics.drawPoint(new Point2D(300, 300));
		graphics.drawLine(new Point2D(-graphics.getWidth() / 2, 0), new Point2D(graphics.getWidth() / 2, 0));
		graphics.drawLine(new Point2D(0, -graphics.getHeight() / 2), new Point2D(0, graphics.getHeight() / 2));
		graphics.drawUpText("X - Axis", new Point2D(graphics.getWidth() / 2, 0));
		graphics.drawUpText("Y - Axis", new Point2D(0, graphics.getHeight() / 2));
	}
	var canvasDomNode = document.getElementById("canvas_node");
	graphics = new Graphics(get2DContext("canvas_node"));
	graphics.translate(graphics.getWidth() / 2, graphics.getHeight() / 2);
	graphics.scale(1, -1);
	graphics.drawLine(new Point2D(-graphics.getWidth() / 2, 0), new Point2D(graphics.getWidth() / 2, 0));
	graphics.drawLine(new Point2D(0, -graphics.getHeight() / 2), new Point2D(0, graphics.getHeight() / 2));
	canvasDomNode.addEventListener("mousemove", mouseMoveListener, false);
	canvasDomNode.addEventListener("mousedown", mouseDownListener, false);
	canvasDomNode.addEventListener("mouseup", mouseUpListener, false);
	canvasDomNode.addEventListener("DOMMouseScroll", mouseWheelListener, false);
}

HtmlDom.addEventListener(window, "onload", test2);
