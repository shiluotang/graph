function getDomNode(nodeOrId) {
	if(nodeOrId instanceof String || typeof(nodeOrId) === "string")
		return document.getElementById(nodeOrId);
	return nodeOrId;
}

function get2DContext(nodeOrId) {
	var node = getDomNode(nodeOrId);
	var ctx = null;
	if(node.getContext) try {
		ctx = node.getContext("2d");
	} catch(e) {
	}
	if(ctx === null)
		throw new Error("can NOT get 2d context from " + nodeOrId);
	return ctx;
}

function test1() {
	try {
		var pen1 = new Pen(Color.RED, 1);
		var pen2 = new Pen(Color.BLUE, 3);

		var g = new Graph(get2DContext("canvas_node"), pen2);
		var w = g.getWidth();
		var h = g.getHeight();
		var N = 12;
		var points = new Array(N);
		var ratio = 0.0;
		for(var i = 0; i < N; ++i) {
			ratio = i / (N -1);
			points[i] = new Point2D(ratio * w , Math.random() * g.getHeight());
		}
		g.clear();
		g.setPen(pen2);
		g.drawPoints(points, 0, points.length - 1, 5);
		g.setPen(pen1);
		g.drawText("Hello World!", new Point2D(0, 10));
		g.drawCurve(points);

		//var img = new Image();
		//img.onload = function() {
		//	g.drawImage(img, Point2D.ORIGIN);
		//};
		//img.src = "images/frame.png";
		//var img2 = new Image();
		//img2.onload = function() {
		//	g.drawSlicedImage(img2,
		//		new Rectangle(new Point2D(33, 71), 104, 124),
		//		new Rectangle(new Point2D(21, 20), 87, 104));
		//};
		//img2.src = "images/rhino.jpg";
		//window.setTimeout(arguments.callee, 3000);
		
	} catch(e) {
		window.alert(e);
	}
}

function SimpleCatroon() {
	this.points = new Array(10);
	for(var i = 0; i < this.points.length; ++i)
		this.points[i] = new Point2D(0, 0);
	this.offset = 0;
	this.CIRCLE_RADIAN = Math.PI * 2;
}
SimpleCatroon.prototype = new Painter();
SimpleCatroon.prototype.paint = function(graph) {
	var len = this.points.length;
	var w = graph.getWidth();
	var h = graph.getHeight();
	h *= 0.5;
	var coeff = 1 / (len - 1);
	var ratio = 0.0;
	for(var i = 0; i < len; ++i) {
		ratio = i * coeff;
		this.points[i].x = ratio * w;
		//this.points[i].y = Math.random() * h;
		this.points[i].y = (Math.sin(ratio * this.CIRCLE_RADIAN + this.offset) + 1) * h;
	}
	graph.clear();
	graph.drawPoints(this.points);
	this.offset += this.CIRCLE_RADIAN / 50;
	return true;
}

function GravityCartoon(h, a, v) {
	this.h0 = h;
	this.h = h;
	this.acceleration = a || 9.8 * 100;
	this.velocity = v || 0.0;
	this.point = new Point2D(0, 0);
}
GravityCartoon.prototype = new Painter();
GravityCartoon.prototype.paint = function(graph) {
	var t = 1 / 24;
	var v = this.velocity;
	var delta_v = this.acceleration * t;
	var s = (v + 0.5 * delta_v) * t;
	this.velocity = v + delta_v;
	if(this.h < s) {
		this.h = 0;
		this.velocity *= -.7;
	} else
		this.h -= s;
	this.point.y = this.h0 - this.h;
	graph.clear();
	graph.drawPoint(this.point);
	return true;
}

function test2() {
	try {
		//var pen1 = new Pen(Color.RED, 1);
		//var pen2 = new Pen(Color.BLUE, 5);
		//var g = new Graph(get2DContext("canvas_node"), pen2);
		//var painter = new GravityCartoon(g.getHeight());
		//var movie = new FrameMovie(g, painter);
		//movie.start();
	} catch(e) {
		window.alert(e);
	}
}

window.addEventListener("load", test2, true);
