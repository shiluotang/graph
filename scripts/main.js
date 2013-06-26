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
	this.delta = Math.PI / 2 / 300;
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
	g.drawText("X", xAxis);
	g.drawText("Y", yAxis);
	g.drawText("Z", zAxis);
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
	var g = new Graphics(get2DContext("canvas_node"));
	g.translate(g.getWidth() / 2, g.getHeight() / 2);
	g.scale(1, -1);
	var rotating = new Rotating(g);
	var timer = new Timer(rotating, 1000 / 24);
	timer.start();
}

HtmlDom.addEventListener(window, "onload", test1);
