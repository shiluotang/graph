function Painter() {}
Painter.prototype = new RootObject();
Painter.prototype.paint = function(graph) {}

function FrameMovie(graph, painter, fps) {
	this.graph = graph;
	this.painter = painter;
	this.fps = fps || 24;
	this.isPlaying = false;
	this.handle = null;
}
FrameMovie.prototype = new RootObject();
FrameMovie.prototype.run = function() {
	if(!this.isPlaying || this.handle === null)
		return;
	this.painter.paint(this.graph);
	var me = this;
	this.handle = window.setTimeout(function() { me.run(); }, 1000 / this.fps);
}
FrameMovie.prototype.start = function() {
	if(this.isPlaying)
		return;
	this.isPlaying = true;
	var me = this;
	if(this.painter.paint(this.graph))
		this.handle = window.setTimeout(function() { me.run(); }, 1000 / this.fps);
	else
		this.stop();
}
FrameMovie.prototype.stop = function() {
	if(this.handle === null)
		return;
	window.clearTimeout(this.handle);
	this.handle = null;
	this.isRunning = false;
}


