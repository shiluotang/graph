function Matrix(rows, columns, data) {
	this.rows = rows || 0;
	this.columns = columns || 0;
	this.size = this.rows * this.columns;
	if(!!this.data)
		this.data = data;
	else {
		this.data = new Array(this.size);
		for(var i = 0; i < this.size; ++i)
			this.data[i] = 0;
	}
}
Matrix.prototype = new RootObject();
Matrix.prototype.rows = undefined;
Matrix.prototype.columns = undefined;
Matrix.prototype.size = undefined;
Matrix.prototype.data = undefined;

Matrix.assign = function(a, c, size) {
	for(var i = 0; i < size; ++i)
		c[i] = a[i];
}
Matrix.add = function(a, b, c, size) {
	for(var i = 0; i < size; ++i)
		c[i] = a[i] + b[i];
}
Matrix.substract = function(a, b, c, size) {
	for(var i = 0; i < size; ++i)
		c[i] = a[i] - b[i];
}
Matrix.scale = function(a, n, c, size) {
	for(var i = 0; i < size; ++i)
		c[i] = a[i] * n;
}
Matrix.transpose = function(a, c, rows, columns) {
	var aIndex = 0;
	for(var i = 0; i < rows; ++i)
		for(var j = 0; j < columns; ++j)
			c[j * rows + i] = a[aIndex++];
}
Matrix.multiply = function(a, b, c, rowsA, columnsA, rowsB, columnsB) {
	var sum = 0;
	for(var i = 0; i < rowsA; ++i) {
		for(var j = 0; j < columnsB; ++j) {
			sum = 0;
			for(var k = 0; k < columnsA; ++k)
				sum += a[i * columnsA + k] * b[k * columnsB + j];
			c[i * columnsB + j] = sum;
		}
	}
}

Matrix.prototype.assign = function(other) {
	Matrix.assign(this.data, other.data, this.size);
	return this;
}
Matrix.prototype.set = function(i, j, value) {
	this.data[i * this.columns + j] = value;
}
Matrix.prototype.get = function(i, j) {
	return this.data[i * this.columns + j];
}
Matrix.prototype.add = function(other) {
	var c = new Matrix(this.rows, this.columns);
	Matrix.add(this.data, other.data, c.data, this.size);
	return c;
}
Matrix.prototype.substract = function(other) {
	var c = new Matrix(this.rows, this.columns);
	Matrix.substract(this.data, other.data, c.data, this.size);
	return c;
}
Matrix.prototype.scale = function(n) {
	var c = new Matrix(this.rows, this.columns);
	Matrix.substract(this.data, n, c.data, this.size);
	return c;
}
Matrix.prototype.addSelf = function(other) {
	Matrix.add(this.data, other.data, this.data, this.size);
	return this;
}
Matrix.prototype.substractSelf = function(other) {
	Matrix.substract(this.data, other.data, this.data, this.size);
	return this;
}
Matrix.prototype.scaleSelf = function(other) {
	Matrix.scale(this.data, other.data, this.data, this.size);
	return this;
}
Matrix.prototype.transpose = function() {
	var c = new Matrix(this.columns, this.rows);
	Matrix.transpose(this.data, c.data,
			this.rows, this.columns);
	return c;
}
Matrix.prototype.multiply = function(other) {
	if(this.columns !== other.rows)
		throw new Error("matrice can't multiply");
	var c = new Matrix(this.rows, other.columns);
	Matrix.multiply(this.data, other.data, c.data,
			this.rows, this.columns,
			other.rows, other.columns);
	return c;
}
Matrix.prototype.setIdentity = function() {
	var index = 0;
	for(var i = 0; i < this.rows; ++i)
		for(var j = 0; j < this.columns; ++j)
			this.data[index++] = ((i !== j) ? 0 : 1);
	return this;
}
Matrix.prototype.toString = function() {
	var startpos = 0;
	var endpos = 0;
	var vectors = new Array(this.rows);
	for(var i = 0; i < this.rows; ++i) {
		endpos = startpos + this.columns;
		vectors[i] = this.data
			.slice(startpos, endpos)
			.join(',');
		startpos = endpos;
	}
	return vectors.join('\n');
}

function Matrix3() {
	this.m00 = 0; this.m01 = 0; this.m02 = 0;
	this.m10 = 0; this.m11 = 0; this.m12 = 0;
	this.m20 = 0; this.m21 = 0; this.m22 = 0;
}
Matrix3.prototype = new RootObject();
Matrix3.prototype.m00 = undefined;
Matrix3.prototype.m01 = undefined;
Matrix3.prototype.m02 = undefined;
Matrix3.prototype.m10 = undefined;
Matrix3.prototype.m11 = undefined;
Matrix3.prototype.m12 = undefined;
Matrix3.prototype.m20 = undefined;
Matrix3.prototype.m21 = undefined;
Matrix3.prototype.m22 = undefined;

Matrix3.assign = function(a, c) {
	c.m00 = a.m00; c.m01 = a.m01; c.m02 = a.m02;
	c.m10 = a.m10; c.m11 = a.m11; c.m12 = a.m12;
	c.m20 = a.m20; c.m21 = a.m21; c.m22 = a.m22;
}
Matrix3.add = function(a, b, c) {
	c.m00 = a.m00 + b.m00; c.m01 = a.m01 + b.m01; c.m02 = a.m02 + b.m02;
	c.m10 = a.m10 + b.m10; c.m11 = a.m11 + b.m11; c.m12 = a.m12 + b.m12;
	c.m20 = a.m20 + b.m20; c.m21 = a.m21 + b.m21; c.m22 = a.m22 + b.m22;
}
Matrix3.substract = function(a, b, c) {
	c.m00 = a.m00 - b.m00; c.m01 = a.m01 - b.m01; c.m02 = a.m02 - b.m02;
	c.m10 = a.m10 - b.m10; c.m11 = a.m11 - b.m11; c.m12 = a.m12 - b.m12;
	c.m20 = a.m20 - b.m20; c.m21 = a.m21 - b.m21; c.m22 = a.m22 - b.m22;
}
Matrix3.scale = function(a, n, c) {
	c.m00 = a.m00 * n; c.m01 = a.m01 * n; c.m02 = a.m02 * n;
	c.m10 = a.m10 * n; c.m11 = a.m11 * n; c.m12 = a.m12 * n;
	c.m20 = a.m20 * n; c.m21 = a.m21 * n; c.m22 = a.m22 * n;
}
Matrix3.transpose = function(a, c) {
	var v1 = 0, v2 = 0;
	c.m00 = a.m00; c.m11 = a.m11; c.m22 = a.m22;

	v1 = a.m01; v2 = a.m10; c.m10 = v1; c.m01 = v2;
	v1 = a.m02; v2 = a.m20; c.m20 = v1; c.m02 = v2;

	v1 = a.m12; v2 = a.m21; c.m21 = v1; c.m12 = v2;
}
Matrix3.setIdentity = function(c) {
	c.m00 = 1; c.m01 = 0; c.m02 = 0;
	c.m10 = 0; c.m11 = 1; c.m12 = 0;
	c.m20 = 0; c.m21 = 0; c.m22 = 1;
}
Matrix3.multiply = function(a, b, c) {
	c.m00 = a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20;
	c.m01 = a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21;
	c.m02 = a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22;

	c.m10 = a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20;
	c.m11 = a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21;
	c.m12 = a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22;

	c.m20 = a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20;
	c.m21 = a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21;
	c.m22 = a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22;
}

Matrix3.prototype.assign = function(other) {
	Matrix3.assign(other, this);
	return this;
}
Matrix3.prototype.add = function(other) {
	var c = new Matrix3();
	Matrix3.add(this, other, c);
	return c;
}
Matrix3.prototype.substract = function(other) {
	var c = new Matrix3();
	Matrix3.substract(this, other, c);
	return c;
}
Matrix3.prototype.scale = function(n) {
	var c = new Matrix3();
	Matrix3.scale(this, n, c);
	return c;
}
Matrix3.prototype.transpose = function() {
	var c = new Matrix3();
	Matrix3.transpose(this, c);
	return c;
}
Matrix3.prototype.multiply = function(other) {
	var c = new Matrix3();
	Matrix3.multiply(this, other, c);
	return c;
}
Matrix3.prototype.addSelf = function(other) {
	Matrix3.add(this, other, this);
	return this;
}
Matrix3.prototype.substractSelf = function(other) {
	Matrix3.substract(this, other, this);
	return this;
}
Matrix3.prototype.scaleSelf = function(n) {
	Matrix3.scale(this, n, this);
	return this;
}
Matrix3.prototype.transposeSelf = function() {
	Matrix3.transpose(this, this);
	return c;
}
Matrix3.prototype.setIdentity = function() {
	Matrix3.setIdentity(this);
}

Matrix3.prototype.toString = function() {
	var row0 = [this.m00, this.m01, this.m02].join(',');
	var row1 = [this.m10, this.m11, this.m12].join(',');
	var row2 = [this.m20, this.m21, this.m22].join(',');
	return [row0, row1, row2].join("\n");
}

function Matrix4() {
	Matrix3.call(this);
	this.m03 = 0; this.m13 = 0; this.m23 = 0;
	this.m30 = 0; this.m31 = 0; this.m32 = 0;
	this.m33 = 0;
}
Matrix4.prototype = new Matrix3();
Matrix4.prototype.m03 = undefined;
Matrix4.prototype.m13 = undefined;
Matrix4.prototype.m23 = undefined;
Matrix4.prototype.m30 = undefined;
Matrix4.prototype.m31 = undefined;
Matrix4.prototype.m32 = undefined;
Matrix4.prototype.m33 = undefined;

Matrix4.assign = function(a, c) {
	Matrix3.assign(a, c);
	c.m03 = a.m03; c.m13 = a.m13; c.m23 = a.m23;
	c.m30 = a.m30; c.m31 = a.m31; c.m32 = a.m32; c.m33 = a.m33;
}
Matrix4.add = function(a, b, c) {
	Matrix3.add(a, b, c);
	c.m03 = a.m03 + b.m03;
	c.m13 = a.m13 + b.m13;
	c.m23 = a.m23 + b.m23;

	c.m33 = a.m33 + b.m33;
	c.m30 = a.m30 + b.m30;
	c.m31 = a.m31 + b.m31;
	c.m32 = a.m32 + b.m32;
}
Matrix4.substract = function(a, b, c) {
	Matrix3.substract(a, b, c);
	c.m03 = a.m03 - b.m03;
	c.m13 = a.m13 - b.m13;
	c.m23 = a.m23 - b.m23;

	c.m33 = a.m33 - b.m33;
	c.m30 = a.m30 - b.m30;
	c.m31 = a.m31 - b.m31;
	c.m32 = a.m32 - b.m32;
}
Matrix4.scale = function(a, n, c) {
	Matrix3.scale(a, n, c);
	c.m03 = a.m03 * n;
	c.m13 = a.m13 * n;
	c.m23 = a.m23 * n;

	c.m33 = a.m33 * n;
	c.m30 = a.m30 * n;
	c.m31 = a.m31 * n;
	c.m32 = a.m32 * n;
}
Matrix4.transpose = function(a, c) {
	Matrix3.transpose(a, c);
	var v1 = 0, v2 = 0;

	v1 = a.m03; v2 = a.m30; c.m30 = v1; c.m03 = v2;
	v1 = a.m13; v2 = a.m31; c.m31 = v1; c.m13 = v2;
	v1 = a.m23; v2 = a.m32; c.m32 = v1; c.m23 = v2;

	c.m33 = a.m33;
}
Matrix4.setIdentity = function(c) {
	Matrix3.setIdentity(c);
	c.m03 = 0; c.m13 = 0; c.m23 = 0;
	c.m33 = 1;
}
Matrix4.multiply = function(a, b, c) {
	c.m00 = a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20 + a.m03 * b.m30;
	c.m01 = a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21 + a.m03 * b.m31;
	c.m02 = a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22 + a.m03 * b.m32;
	c.m03 = a.m00 * b.m03 + a.m01 * b.m13 + a.m02 * b.m23 + a.m03 * b.m33;

	c.m10 = a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20 + a.m13 * b.m30;
	c.m11 = a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31;
	c.m12 = a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32;
	c.m13 = a.m10 * b.m03 + a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33;

	c.m20 = a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20 + a.m23 * b.m30;
	c.m21 = a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31;
	c.m22 = a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32;
	c.m23 = a.m20 * b.m03 + a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33;

	c.m30 = a.m30 * b.m00 + a.m31 * b.m10 + a.m32 * b.m20 + a.m33 * b.m30;
	c.m31 = a.m30 * b.m01 + a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31;
	c.m32 = a.m30 * b.m02 + a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32;
	c.m33 = a.m30 * b.m03 + a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33;
}

Matrix4.prototype.assign = function(other) {
	Matrix4.assign(other, this);
	return this;
}
Matrix4.prototype.add = function(other) {
	var c = new Matrix4();
	Matrix4.add(this, other, c);
	return c;
}
Matrix4.prototype.substract = function(other) {
	var c = new Matrix4();
	Matrix4.substract(this, other, c);
	return c;
}
Matrix4.prototype.scale = function(other) {
	var c = new Matrix4();
	Matrix4.scale(this, other, c);
	return c;
}
Matrix4.prototype.transpose = function() {
	var c = new Matrix4();
	Matrix4.transpose(this, c);
	return c;
}

Matrix4.prototype.addSelf = function(other) {
	Matrix4.add(this, other, this);
	return this;
}
Matrix4.prototype.substractSelf = function(other) {
	Matrix4.substract(this, other, this);
	return this;
}
Matrix4.prototype.scaleSelf = function(n) {
	Matrix4.scale(this, n, this);
	return this;
}
Matrix4.prototype.transposeSelf = function() {
	Matrix4.transpose(this, this);
	return this;
}
Matrix4.prototype.setIdentity = function() {
	Matrix4.setIdentity(this);
	return this;
}
Matrix4.prototype.multiply = function(other) {
	var c = new Matrix4();
	Matrix4.multiply(this, other, c);
	return c;
}
Matrix4.prototype.toString = function() {
	var row0 = [this.m00, this.m01, this.m02, this.m03].join(',');
	var row1 = [this.m10, this.m11, this.m12, this.m13].join(',');
	var row2 = [this.m20, this.m21, this.m22, this.m23].join(',');
	var row3 = [this.m30, this.m31, this.m32, this.m33].join(',');
	return [row0, row1, row2, row3].join("\n");
}

function Vector(size) {
	this.size = size || 0;
	this.data = new Array(this.size);
	for(var i = 0; i < this.size; ++i)
		this.data[i] = 0;
}
Vector.prototype = new RootObject();
Vector.prototype.size = undefined;
Vector.prototype.data = undefined;

Vector.assign = function(a, c, size) {
	for(var i = 0; i < size; ++i)
		c[i] = a[i];
}
Vector.add = function(a, b, c, size) {
	for(var i = 0; i < size; ++i)
		c[i] = a[i] + b[i];
}
Vector.substract = function(a, b, c, size) {
	for(var i = 0; i < size; ++i)
		c[i] = a[i] - b[i];
}
Vector.scale = function(a, n, c, size) {
	for(var i = 0; i < size; ++i)
		c[i] = a[i] * n;
}
Vector.dotProduct = function(a, b, size) {
	var sum = 0;
	for(var i = 0; i < size; ++i)
		sum += a[i] * b[i];
	return sum;
}
Vector.normalize = function(a, c, size) {
	Vector.scale(a, 1 / Math.sqrt(Vector.dotProduct(a, a, size)), c, size);
}

Vector.prototype.assign = function(other) {
	Vector.assign(other.data, this.data, this.size);
	return this;
}
Vector.prototype.add = function(other) {
	var c = new Vector(this.size);
	Vector.add(this.data, other.data, c.data, this.size);
	return c;
}
Vector.prototype.substract = function(other) {
	var c = new Vector(this.size);
	Vector.substract(this.data, other.data, c.data, this.size);
	return c;
}
Vector.prototype.scale = function(n) {
	var c = new Vector(this.size);
	Vector.scale(this.data, other.data, c.data, this.size);
	return c;
}
Vector.prototype.dotProduct = function(other) {
	return Vector.dotProduct(this.data, other.data, this.size);
}
Vector.prototype.addSelf = function(other) {
	Vector.add(this.data, other.data, this.data, this.size);
	return this;
}
Vector.prototype.substractSelf = function(other) {
	Vector.substract(this.data, other.data, this.data, this.size);
	return this;
}
Vector.prototype.scaleSelf = function(n) {
	Vector.scale(this.data, n, this.data, this.size);
	return this;
}
Vector.prototype.toString = function() { return this.data.join(','); }
Vector.prototype.toMatrix = function() {
	var m = new Matrix(this.size, 1);
	for(var i = 0; i < this.size; ++i)
		m.data[i] = this.data[i];
	return m;
}
Vector.prototype.normalize = function() {
	var c = new Vector(this.size);
	Vector.normalize(this.data, c.data, this.size);
	return c;
}
Vector.prototype.normalizeSelf = function() {
	return Vector.normalize(this.data, this.data, this.size);
}

function Vector3(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}

Vector3.prototype = new RootObject();
Vector3.prototype.x = undefined;
Vector3.prototype.y = undefined;
Vector3.prototype.z = undefined;

Vector3.assign = function(a, c) {
	c.x = a.x;
	c.y = a.y;
	c.z = a.z;
}
Vector3.add = function(a, b, c) {
	c.x = a.x + b.x;
	c.y = a.y + b.y;
	c.z = a.z + b.z;
}
Vector3.substract = function(a, b, c) {
	c.x = a.x - b.x;
	c.y = a.y - b.y;
	c.z = a.z - b.z;
}
Vector3.scale = function(a, n, c) {
	c.x = a.x * n;
	c.y = a.y * n;
	c.z = a.z * n;
}
Vector3.dotProduct = function(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}
Vector3.normalize = function(a, c) {
	return Vector3.scale(a, 1 / Math.sqrt(Vector3.dotProduct(a, a)), c);
}

Vector3.prototype.add = function(other) {
	var c = new Vector3();
	Vector3.add(this, other, c);
	return c;
}
Vector3.prototype.substract = function(other) {
	var c = new Vector3();
	Vector3.substract(this, other, c);
	return c;
}
Vector3.prototype.scale = function(other) {
	var c = new Vector3();
	Vector3.scale(this, other, c);
	return c;
}
Vector3.prototype.addSelf = function(other) {
	Vector3.add(this, other, this);
	return this;
}
Vector3.prototype.substractSelf = function(other) {
	Vector3.substract(this, other, this);
	return this;
}
Vector3.prototype.scaleSelf = function(other) {
	Vector3.scale(this, other, this);
	return this;
}
Vector3.prototype.dotProduct = function(other) {
	return Vector3.dotProduct(this, other);
}
Vector3.prototype.toString = function() {
	return [this.x, this.y, this.z].join(',');
}
Vector3.prototype.normalize = function() {
	var c = new Vector3();
	Vector3.normalize(this, c);
	return c;
}
Vector3.prototype.normalizeSelf = function() {
	Vector3.normalize(this, this);
	return this;
}

function Vector4(x, y, z, w) {
	Vector3.call(this, x, y, z);
	this.w = 0;
}

Vector4.prototype = new Vector3();
Vector4.prototype.w = undefined;

Vector4.assign = function(a, c) {
	Vector3.assign(a, c);
	c.w = a.w;
}
Vector4.add = function(a, b, c) {
	Vector3.add(a, b, c);
	c.w = a.w + b.w;
}
Vector4.substract = function(a, b, c) {
	Vector3.substract(a, b, c);
	c.w = a.w - b.w;
}
Vector4.scale = function(a, n, c) {
	Vector3.scale(a, n, c);
	c.w = a.w * n;
}
Vector4.dotProduct = function(a, b) {
	return Vector3.dotProduct(a, b) + a.w * b.w;
}
Vector4.normalize = function(a, c) {
	Vector4.scale(a, 1 / Math.sqrt(Vector4.dotProduct(a, a)), c);
}

Vector4.prototype.add = function(other) {
	var c = new Vector4();
	Vector4.add(this, other, c);
	return c;
}
Vector4.prototype.substract = function(other) {
	var c = new Vector4();
	Vector4.substract(this, other, c);
	return c;
}
Vector4.prototype.scale = function(other) {
	var c = new Vector4();
	Vector4.scale(this, other, c);
	return c;
}
Vector4.prototype.addSelf = function(other) {
	Vector4.add(this, other, this);
	return this;
}
Vector4.prototype.substractSelf = function(other) {
	Vector4.substract(this, other, this);
	return this;
}
Vector4.prototype.scaleSelf = function(other) {
	Vector4.scale(this, other, this);
	return this;
}
Vector4.prototype.dotProduct = function(other) {
	return Vector4.dotProduct(this, other);
}
Vector4.prototype.toString = function() {
	return [this.x, this.y, this.z, this.w].join(',');
}
Vector4.prototype.normalize = function() {
	var c = new Vector4();
	Vector4.normalize(this, c);
	return c;
}
Vector4.prototype.normalizeSelf = function() {
	Vector4.normalize(this, this);
	return this;
}

