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
            if(me.isRunning && me.runnable.run())
                me.handle = window.setTimeout(me.worker, me.interval);
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

function AnimationTimer(runnable) {
    var requestAnimationFrameImpl = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame;
    var cancelAnimationFrameImpl = window.cancelAnimationFrame
        || window.mozCancelAnimationFrame
        || window.webkitCancelAnimationFrame
        || window.msCancelAnimationFrame;
    if(!requestAnimationFrameImpl || !cancelAnimationFrameImpl)
        throw new Error("animation frame api is not supported!");
    if(!(this.runnable = Runnable.wrap(runnable)))
        throw new Error("can't make a runnable object from " + runnable);
    RootObject.call(this);
    var me = this;
    this.handle = undefined;
    this.isRunning = false;
    this.requestAnimationFrame = requestAnimationFrameImpl;
    this.cancelAnimationFrame = cancelAnimationFrameImpl;
    this.worker = function() {
        if(me.isRunning && me.runnable.run())
            me.handle = me.requestAnimationFrame.call(null, me.worker);
        else
            me.stop();
    };
}
AnimationTimer.prototype = new RootObject();
AnimationTimer.prototype.start = function() {
    if(this.isRunning)
        return;
    this.isRunning = true;
    this.worker();
}
AnimationTimer.prototype.stop = function() {
    this.isRunning = false;
    this.isInteruppted = true;
    if(this.handle !== undefined && this.handle !== null) {
        if(this.cancelAnimationFrame)
            this.cancelAnimationFrame.call(null, this.handle);
        this.handle = null;
    }
}
