function HyperPlane(w, b) {
    this.w = w || new Vector3();
    this.b = b || 0;
}
HyperPlane.prototype = new RootObject();
HyperPlane.prototype.w = undefined;
HyperPlane.prototype.b = undefined;

function Observer(position, R, U, D, d) {
    this.position = position || new Vector3();
    this.R = R || new Vector3(1, 0, 0);
    this.U = U || new Vector3(0, 1, 0);
    this.D = D || new Vector3(0, 0, -1);
    //projection plane distance from observer position
    this.d = d || 5;
}
Observer.prototype = new RootObject();
Observer.prototype.position = undefined;
Observer.prototype.R = undefined;
Observer.prototype.U = undefined;
Observer.prototype.D = undefined;
Observer.prototype.d = undefined;

//YOZ
Observer.prototype.rotateX = function(radian) {
    var cosine = Math.cos(radian);
    var sine = Math.sin(radian);

    var z = 0, x = 0;

    y = this.R.y; z = this.R.z;
    this.R.y = y * cosine   - z * sine;
    this.R.z = y * sine     + z * cosine;

    y = this.U.y; z = this.U.z;
    this.U.y = y * cosine   - z * sine;
    this.U.z = y * sine     + z * cosine;

    y = this.D.y; z = this.D.z;
    this.D.y = y * cosine   - z * sine;
    this.D.z = y * sine     + z * cosine;
}
//ZOX
Observer.prototype.rotateY = function(radian) {
    var cosine = Math.cos(radian);
    var sine = Math.sin(radian);

    var z = 0, x = 0;

    z = this.R.z; x = this.R.x;
    this.R.z = z * cosine   - x * sine;
    this.R.x = z * sine     + x * cosine;

    z = this.U.z; x = this.U.x;
    this.U.z = z * cosine   - x * sine;
    this.U.x = z * sine     + x * cosine;

    z = this.D.z; x = this.D.x;
    this.D.z = z * cosine   - x * sine;
    this.D.x = z * sine     + x * cosine;
}
//XOY
Observer.prototype.rotateZ = function(radian) {
    var cosine = Math.cos(radian);
    var sine = Math.sin(radian);

    var x = 0, y = 0;

    x = this.R.x; y = this.R.y;
    this.R.x = x * cosine   - y * sine;
    this.R.y = x * sine     + y * cosine;

    x = this.U.x; y = this.U.y;
    this.U.x = x * cosine   - y * sine;
    this.U.y = x * sine     + y * cosine;

    x = this.D.x; y = this.D.y;
    this.D.x = x * cosine   - y * sine;
    this.D.y = x * sine     + y * cosine;
}

Observer.prototype.moveTo = function(newPosition) {
    if(!!newPosition)
        this.position = newPosition;
}

Observer.prototype.getProjectionOrigin = function() {
    return this.position.add(this.D.scale(this.d));
}
Observer.prototype.getProjectionPosition = function(point3d) {
    var t = (this.D.dotProduct(this.position) + this.d) / this.D.dotProduct(this.position.substract(point3d));
    var p2 = new Vector3();
    p2.x = this.position.x + (point3d.x - this.position.x) * t;
    p2.y = this.position.y + (point3d.y - this.position.y) * t;
    p2.z = this.position.z + (point3d.z - this.position.z) * t;
    return p2;
}
Observer.prototype.get2DPosition = function(point3d) {
    var origin = this.getProjectionOrigin();
    var p3d = this.getProjectionPosition(point3d);
    p3d.substractSelf(origin);
    return {x : p3d.dotProduct(this.R), y : p3d.dotProduct(this.U)};
}
