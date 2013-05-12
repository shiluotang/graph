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

HtmlDom.addEventListener(window, "onload", test1);
HtmlDom.addEventListener(window, "onload", test2);
