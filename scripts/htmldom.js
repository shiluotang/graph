function HtmlDom() { }
HtmlDom.prototype = new RootObject();
HtmlDom.isFirefox = new RegExp("Firefox", "i").test(navigator.userAgent);
HtmlDom.$ = function(nodeOrId) {
	if(nodeOrId instanceof String || typeof(nodeOrId) === "string")
		return document.getElementById(nodeOrId);
	return nodeOrId;
}
HtmlDom.addEventListener = function(host, eventName, callback) {
    if(host.attachEvent) {
        if(!eventName.startsWith("on"))
            eventName = "on" + eventName;
        host.attachEvent(eventName, callback);
    } else if(host.addEventListener) {
		if(eventName.startsWith("on"))
			eventName = eventName.substr(2);
        if(eventName === "mousewheel" && HtmlDom.isFirefox)
            eventName = "DOMMouseScroll";
        host.addEventListener(eventName, callback);
	}
}
HtmlDom.removeEventListener = function(host, eventName, callback) {
    if(host.detachEvent) {
        if(!eventName.startsWith("on"))
            eventName = "on" + eventName;
        host.detachEvent(eventName, callback);
    } else if(host.removeEventListener) {
		if(eventName.indexOf("on") == 0)
			eventName = eventName.substr(2);
        if(eventName === "mousewheel" && HtmlDom.isFirefox)
            eventName = "DOMMouseScroll";
        host.removeEventListener(eventName, callback);
	}
}
