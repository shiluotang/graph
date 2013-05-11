//-------------------------------------------------------------
// core
//-------------------------------------------------------------
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
