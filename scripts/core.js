//-------------------------------------------------------------
// core
//-------------------------------------------------------------
var Type = Type || {
	isObject : function(o) { return typeof(o) === "object" || o instanceof Object; },
	isString : function(o) { return typeof(o) === "string" || o instanceof String; },
	isFunction : function(o) { return typeof(o) === "function" || o instanceof Object; },
	isArray : function(o) { return typeof(o) === "array" || o instanceof Array; },
	isNumber : function(o) { return typeof(o) === "number" || o instanceof Number; },
	isDate : function(o) { return typeof(o) === "date" || o instanceof Date; },
	isRegExp : function(o) { return typeof(o) === "regexp" || o instanceof RegExp; },
	isError : function(o) { return typeof(o) === "error" || o instanceof Error; },
	toString : function(o, type) {
		type = type || Object;
		if(o.toString)
			return o.toString;
		return type.prototype.toString.call(o);
	}
};

function enhance(proto, obj, override) {
	for(var prop in obj)
		if(proto[prop] !== undefined) {
			if(override)
				proto[prop] = obj[prop];
		} else
			proto[prop] = obj[prop];
}
var ObjectEnhancement = {
};
var ArrayEnhancement = {
	indexOf : function(item) {
		var len = this.length;
		for(var i = 0; i < len; ++i)
			if(this[i] === item)
				return i;
		return -1;
	},
	lastIndexOf : function(item) {
		var len = this.length;
		for(var i = len - 1; i >= 0; --i)
			if(this[i] === item)
				return i;
		return -1;
	}
};
var JSONEnhancement = {
	parse : function(text, reviver) {
		console.log("not the raw implemetation");
		var obj = window.eval(text);
		var value = null;
		if(reviver === null || reviver === undefined)
			return obj;
		if(reviver instanceof Function || typeof(reviver) === "function") {
			for(var prop in obj) {
				 if((value = reviver(prop, obj[prop])) === undefined)
					 delete obj.prop;
				 else
					 reviver[prop] = value;
			}
		}
	},
	stringify : function(value, replacer, space) {
		console.log("not the raw implemetation");
		var stack = new Array();
		var ident = "";
		var PropList = undefined;
		var ReplacerFunction = undefined;
		if(Type.isFunction(replacer))
			ReplacerFunction = replacer;
		else if(Type.isArray(replacer)) {
			PropList = new Array();
			for(var i = 0; i < replacer.length; ++i) {
				var item = undefined;
				var v = replacer[i];
				if(Type.isString(v))
					item = v;
				else
					item = Type.toString(v);
				if(item)
					PropList.push(item);
			}
		}
		if(Type.isNumber(space) || Type.isString(space))
			space = space.valueOf();
	}
};
enhance(Object.prototype, ObjectEnhancement, false);
enhance(Array.prototype, ArrayEnhancement, false);
enhance(JSON || new Object(), JSONEnhancement, false);

function RootObject() { }
RootObject.prototype.toFieldsString = function() {
	var props = new Array();
	for(var propName in this) {
		try{
			var value = this[propName];
			if(value instanceof Function)
				continue;
			if(value instanceof String || typeof(value) === "string")
				props.push(propName + ":" + "\"" + value + "\"");
			else
				props.push(propName + ":" + value);
		} catch(e) {
		}
	}
	props.sort();
	return props.join(", ");
}
RootObject.prototype.toString = function() { return this.toFieldsString(); }
RootObject.prototype.equals = function(other) { return this === other; }
