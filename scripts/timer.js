function Runnable() { }
Runnable.prototype = new RootObject();
Runnable.prototype.isFinished = function() { return false; }
Runnable.prototype.doRun = function() {}
Runnable.prototype.run = function()  {
	if(this.isFinished())
		return false;
	this.doRun();
	return !this.isFinished();
}
Runnable.wrap = function(callback) {
	if(callback === undefined || callback === null)
		return null;
	if(callback instanceof Runnable)
		return callback;
	if(Type.isFunction(callback)) {
		var wrappedObj = new Runnable();
		wrappedObj.doRun = callback;
		return wrappedObj;
	}
	return null;
}

function Timer(runnable, interval) {
	var me = this;
	this.isRunning = false;
	if(this.runnable = Runnable.wrap(runnable))
		this.worker = function() {
			if(me.isRunning) {
				if(me.runnable.run())
					me.handle = window.setTimeout(me.worker, me.interval);
				else
					me.stop();
			}
			else
				me.stop();
		};
	this.interval = interval || 1000;
}
Timer.prototype = new RootObject();
Timer.prototype.start = function() {
	if(this.isRunning)
		return;
	this.isRunning = true;
	this.worker();
}

Timer.prototype.stop = function() {
	this.isRunning = false;
	this.isInteruppted = true;
	if(this.handle !== undefined && this.handle !== null) {
		window.clearTimeout(this.handle);
		this.handle = null;
	}
}
