/**
 * url is the key.
 * requestData have many parts. here is a sample for demonstration:
 * { 
 * 		method: "GET",
 * 		headers : [{"", ""}, {"", ""} ],
 * 		data : {
 * 			id : 3,
 * 			r : Math.random()
 * 		}
 * }
 */
var Ajax = Ajax || {
	createXHR : function() {
		var xhr = null;
		try {
			if(window.XMLHttpRequest)
				xhr = new XMLHttpRequest();
			else
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {
			throw e;
		}
		return xhr;
	},
	makeRequestData : function(proto) {
		var request = new Object();
		request.url = proto.url;
		request.method = proto.method || "GET";
		request.async = proto.async || true;
		if(proto.credential 
				&& proto.credential.username 
				&& proto.credential.password)
			request.credential = proto.credential;
		request.username = proto.username;
		request.password = proto.username;
		request.headers = proto.headers || [];
		request.data = proto.data || {};
		request.onSuccess = proto.onSuccess;
		request.onFailure = proto.onFailure;
		request.onTimeout = proto.onTimeout;
		request.timeout = proto.timeout || 5000;

		var properties = new Array();
		for(var propName in request.data) {
			var val = request.data[propName];
			if(Type.isFunction(val))
				continue;
			properties.push(propName + "=" + encodeURI(val));
		}
		request.data = properties.join("&");
		properties.length = 0;

		if(request.method === "POST") {
			request.headers.push("Content-Type", "x/www-form-urlencoded");
		} else if (request.method === "GET") {
			var pos = request.url.indexOf('?');
			if(pos === -1) {
				pos = request.url.indexOf("://");
				pos = request.url.indexOf(pos, '/');
				if(pos === -1)
					request.url = request.url + '/?' + request.data;
				else
					request.url = request.url + "?" + request.data;
			} else if(pos < request.url.length() - 1)
				request.url = request.url + "&" + request.data;
			else
				request.url = request.url + request.data;
			request.data = null;
		} else
			request.data = null;
		return request;
	},
	doRequest : function(xhr, requestData) {
		function handleStates(xhr, requestData) {
			switch(xhr.readyState) {
				case 4: 
					if(xhr.status == 200) {
						if(requestData.onSuccess)
							requestData.onSuccess.call(null, xhr, requestData);
					} else {
						if(requestData.onFailure)
							requestData.onFailure.call(null, xhr, requestData);
					}
					break;
				case 3: break;
				case 2: break;
				case 1: break;
				case 0: break;
				default:break;
			}
		}
		xhr.onreadystatechange = function() { handleStates(xhr, requestData); }
		if(requestData.credential)
			xhr.open(requestData.method, requestData.url, requestData.async,
					requestData.credential.username,
					requestData.credential.password);
		else
			xhr.open(requestData.method, requestData.url, requestData.async);
		xhr.send(requestData.data);
	},
	request : function(requestData) {
		var xhr = Ajax.createXHR();
		Ajax.doRequest(xhr, Ajax.makeRequestData(requestData));
		return xhr;
	}
}
