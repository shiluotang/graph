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

		var g = new Graphics(get2DContext("canvas_node"), pen2);
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

function createPoints(graphics) {
	var N = 60;
	var points = new Array(N);
	var w = graphics.getWidth();
	var h = graphics.getHeight();
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

function ScalingAnimation(graphics, points) {
	this.yscaling = 1;
	this.points = points;
	this.penPoints = new Pen(Color.BLUE, 5);
	this.penDefault = new Pen(Color.BLACK, 1);
	this.graphics = graphics;
}
ScalingAnimation.prototype = new Runnable();
ScalingAnimation.prototype.isFinished = function() {
	return this.yscaling < 0.5; 
}
ScalingAnimation.prototype.doRun = function() {
	var graphics = this.graphics;
	var a = new Point2D();
	var b = new Point2D();
	var ratio = 0;
	var N = 10;
	this.yscaling *= 0.999;
	var w = graphics.getWidth();
	var h = graphics.getHeight();

	graphics.ctx.restore();
	graphics.ctx.save();
	graphics.clear();
	var coordsys = new CoordSystem();
	coordsys.scaleVector.y = this.yscaling;
	graphics.setCoordSystem(coordsys);
	graphics.setPen(this.penPoints);
	graphics.drawPoints(this.points);
	graphics.setPen(this.penDefault);
	graphics.drawCurve(this.points);
	graphics.drawText("What", new Point2D(0, 10));
	for(var i = 0; i < N; ++i) {
		ratio = i / (N - 1);
		a.x = 0;
		a.y = ratio * h;
		b.x = w;
		b.y = a.y;
		graphics.drawLine(a, b);
	}
}

function test3() {
	var g = new Graphics(get2DContext("canvas_node"));
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

function test4() {
	var g = new Graphics(get2DContext("canvas_node"));
	var cartesian = new CoordSystem(
			new Point2D(0, g.getHeight()),
			0,
			new Point2D(1, -1));
	g.setCoordSystem(cartesian);

	var v = new Vector(3);
	v.data[0] = 3;
	v.data[1] = 4;
	v.data[2] = 1;
	var p = v.toMatrix();
	var scaleMatrix = new Matrix(3, 3);
	scaleMatrix.setIdentity();
	scaleMatrix.set(0, 0, 10);
	scaleMatrix.set(1, 1, 20);

	var translateMatrix = new Matrix(3, 3);
	translateMatrix.setIdentity();
	translateMatrix.set(0, 2, 50);
	translateMatrix.set(1, 2, 100);

	var rotateMatrix = new Matrix(3, 3);
	var theta = Math.PI / 6;
	rotateMatrix.setIdentity();
	rotateMatrix.set(0, 0, Math.cos(theta));
	rotateMatrix.set(0, 1, -Math.sin(theta));
	rotateMatrix.set(1, 0, Math.sin(theta));
	rotateMatrix.set(1, 1, Math.cos(theta));

	console.log(scaleMatrix.multiply(rotateMatrix.multiply(translateMatrix.multiply(p))).toString());
	console.log(scaleMatrix.multiply(rotateMatrix).multiply(translateMatrix).multiply(p).toString());
}

HtmlDom.addEventListener(window, "onload", test4);
