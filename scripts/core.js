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
    isOfSimpleType : function(o) {
        return Type.isString(o)
            || Type.isFunction(o)
            || Type.isNumber(o)
            || Type.isDate(o)
            || Type.isRegExp(o)
            || Type.isError(o);
    },
    toString : function(o, type) {
        type = type || Object;
        if(o.toString)
            return o.toString();
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
var ObjectEnhancement = { };
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
        function dumpArray(a) {
            var len = a.length;
            var elements = new Array(len);
            for(var i = 0; i < len; ++i)
                elements[i] = dump(a[i]);
            return "[" + elements.join(",") + "]";
        }
        function dumpObj(obj) {
            var props = new Array();
            var item = "";
            for(var propName in obj) {
                item = "";
                item.concat("\"", propName, "\" : ", dump(obj[propName]));
                props.push(item);
            }
            return "{" + props.join(",") + "}";
        }
        function dump(x) {
            var toJSON = x.toJSON || Object.prototype.toJSON;
            if(toJSON)
                return toJSON.call(x);
            if(Type.isOfSimpleType(x))
                return x.toString();
            if(Type.isArray(x))
                return dumpArray(x);
            return dumpObj(x);
        }
        return dump(value);
    }
};
var StringEnhancement = {
    startsWith : function(prefix) { return this.indexOf(prefix) === 0; },
    endsWith : function(suffix) { return this.indexOf(suffix) + suffix.length === this.length; }
}
enhance(Object.prototype, ObjectEnhancement, false);
enhance(Array.prototype, ArrayEnhancement, false);
enhance(String.prototype, StringEnhancement, false);
enhance(JSON || new Object(), JSONEnhancement, false);

function RootObject() { }
RootObject.prototype.toFieldsString = function() { return JSON.stringify(this); }
RootObject.prototype.toString = function() { return this.toFieldsString(); }
RootObject.prototype.equals = function(other) { return this === other; }
