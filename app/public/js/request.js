(function(window) {
	// wrap an http request into a promise
	var request = function request(config, data) {

		var prom = new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();

			xhr.addEventListener('progress', function (evt) {
				console.log(evt);
			});
			
			xhr.addEventListener('load', function (evt) {
				resolve(evt);
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
	};

	window.req = request;
}(window));