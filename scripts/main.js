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
			points[i] = new Point2D(ratio * w , 
					Math.random() * g.getHeight());
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

function test2() {
	var requestData = {
		url: "http://www.baidu.com",
		data : { id : 3 },
		onSuccess : function(xhr, data) { console.log("AJAX OK"); },
		onFailure : function(xhr, data) { console.log("AJAX FAILED" + JSON.stringify(data)); }
	};
	Ajax.request(requestData);
}

function createPoints(graph) {
	var N = 60;
	var points = new Array(N);
	var w = graph.getWidth();
	var h = graph.getHeight();
	var ratio = 0.0;
	for(var i = 0; i < N; ++i) {
		ratio = i / (N - 1);
		points[i] = new Point2D(
					ratio * w,
					(Math.sin(ratio * Math.PI * 2) + 1) * 0.5 * h
				);
	}
	return points;
}

function ScalingAnimation(graph, points) {
	this.yscaling = 1;
	this.points = points;
	this.penPoints = new Pen(Color.BLUE, 5);
	this.penDefault = new Pen(Color.BLACK, 1);
	this.graph = graph;
}
ScalingAnimation.prototype = new Runnable();
ScalingAnimation.prototype.isFinished = function() {
	return this.yscaling < 0.5; 
}
ScalingAnimation.prototype.doRun = function() {
	var graph = this.graph;
	var a = new Point2D();
	var b = new Point2D();
	var ratio = 0;
	var N = 10;
	this.yscaling *= 0.999;
	var w = graph.getWidth();
	var h = graph.getHeight();

	graph.ctx.restore();
	graph.ctx.save();
	graph.clear();
	var coordsys = graph.getCoordSystem();
	coordsys.scaleVector.y = this.yscaling;
	graph.setCoordSystem(coordsys);
	graph.setPen(this.penPoints);
	graph.drawPoints(this.points);
	graph.setPen(this.penDefault);
	graph.drawCurve(this.points);
	graph.drawText("What", new Point2D(0, 10));
	for(var i = 0; i < N; ++i) {
		ratio = i / (N - 1);
		a.x = 0;
		a.y = ratio * h;
		b.x = w;
		b.y = a.y;
		graph.drawLine(a, b);
	}
}

function test3() {
	var g = new Graph(get2DContext("canvas_node"));
	var cartesian = new CoordSystem(
			new Point2D(0, g.getHeight()),
			0,
			new Point2D(1, -1));
	g.setCoordSystem(cartesian);
	/*
	g.drawText("I'm inversed!", new Point2D(0, 10));
	g.setCoordSystem(new CoordSystem(null, null, new Point2D(1, -1)));
	g.drawText("I'm origin!", new Point2D(0, -20));
	*/
	var animation = new ScalingAnimation(g, createPoints(g));
	var player = new Timer(animation, 1000 / 24);
	player.start();
}

HtmlDom.addEventListener(window, "onload", test3);
