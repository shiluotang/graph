function HtmlDom() { }
HtmlDom.prototype = new RootObject();
HtmlDom.$ = function(nodeOrId) {
	if(nodeOrId instanceof String || typeof(nodeOrId) === "string")
		return document.getElementById(nodeOrId);
	return nodeOrId;
}
HtmlDom.addEventListener = function(host, eventName, callback) {
	var binder = null;
	if(host.addEventListener) {
		if(eventName.indexOf("on") == 0)
			eventName = eventName.substr(2);
		binder = host.addEventListener;
	} else
		binder = host.attachEvent;
	var origin = host[eventName];
	if(!origin)
		binder.call(host, eventName, callback);
	else {
		host[eventName] = function() {
			origin.apply(null, arguments);
			callback.apply(null, arguments);
		}
	}
}
