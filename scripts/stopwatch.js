function Stopwatch() {
    this._M_startTimestamp = 0;
    this._M_isRunning = false;
    this._M_elapsedMillis = 0;
}

Stopwatch.prototype = RootObject();
Stopwatch.prototype._M_startTimestamp = undefined;
Stopwatch.prototype._M_isRunning = undefined;
Stopwatch.prototype._M_elapsedMillis = 0;

Stopwatch.prototype.start = function() {
    if (this._M_isRunning)
        return;
    this._M_startTimestamp = this.currentTimestamp();
    this._M_isRunning = true;
};
Stopwatch.prototype.stop = function() {
    if (!this._M_isRunning)
        return;
    this._M_isRunning = false;
    this._M_elapsedMillis += this.currentTimestamp() - this._M_startTimestamp;
};
Stopwatch.prototype.reset = function() {
    this._M_isRunning = false;
    this._M_elapsedMillis = 0;
}
Stopwatch.prototype.clear = function() {
    if (this._M_isRunning)
        this._M_startTimestamp = this.currentTimestamp();
    this._M_elapsedMillis = 0;
}
Stopwatch.prototype.elapsedMillis = function() {
    if (this._M_isRunning)
        return this._M_elapsedMillis + (currentTimestamp() - this._M_startTimestamp);
    return this._M_elapsedMillis;
}
Stopwatch.prototype.currentTimestamp = function() {
    return new Date().getTime();
}
