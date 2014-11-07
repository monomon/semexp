(function(window) {
	// wrap an http request into a promise
	var request = {
		send : function(data, config) {
			var prom = new Promise(function (resolve, reject) {
				var xhr = new XMLHttpRequest();

				// todo: decide what to do with progress
				// xhr.addEventListener('progress', function (evt) {
				// 	console.log(evt);
				// });
				
				xhr.addEventListener('load', function (evt) {
					resolve(JSON.parse(evt.target.responseText));
				});

				xhr.addEventListener('error', function (evt) {
					reject(evt);
				});

				xhr.addEventListener('abort', function (evt) {
					reject(evt);
				});

				xhr.open(
					config.method,
					config.url,
					true
				);

				xhr.send(JSON.stringify(data));
			});
			return prom;
		}
	}

	window.req = request;
}(window));