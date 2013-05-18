function Painter() {}
Painter.prototype = new RootObject();
Painter.prototype.shouldStop = function() { return false; }
Painter.prototype.paint = function(graph) {
	if(this.shouldStop())
		return false;
	this.doPaint(graph);
	return !this.shouldStop();
}
Painter.prototype.doPaint = function() { }

function FrameMovie(graph, painter, fps) {
	this.graph = graph;
	this.painter = painter;
	this.isPlaying = false;
	this.handle = null;
	this.setFps(fps);
	var me = this;
	this.worker = function() { me.run(); };
}
FrameMovie.prototype = new RootObject();
FrameMovie.prototype.setFps = function(fps) {
	fps = fps || 24;
	this.interval = 1000 / fps;
}
FrameMovie.prototype.run = function() {
	if(!this.isPlaying)
		return;
	if(this.painter.paint(this.graph))
		this.handle = setTimeout(this.worker, this.interval);
	else
		this.stop();
}
FrameMovie.prototype.start = function() {
	if(this.isPlaying)
		return;
	this.isPlaying = true;
	this.run();
}
FrameMovie.prototype.stop = function() {
	if(this.handle === null)
		return;
	this.isPlaying = false;
	clearTimeout(this.handle);
	this.handle = null;
}


