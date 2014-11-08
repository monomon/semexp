semexp
======

A semantic graph editing tool

#Usage#
```	
	var explorer = Object.create(window.semexp);
	explorer.init({
		width : 800,
		height : 600
	});

	explorer.load(data);
```
###AJAX example###
```
  function getData(config)
  {
		var xhr = new XMLHttpRequest();
		xhr.addEventListener('load', function (evt) {
			try {
				explorer.load(JSON.parse(evt.target.responseText));
			} catch (e) {
				console.log(e);
			}
		});

		xhr.open(
			config.method,
			config.url,
			true
		);

  	xhr.send();
  }
```
	
#Dependencies#
* [semnet](https://github.com/asciimoo/semnet) for the semantic model
* [d3](https://github.com/mbostock/d3) for drawing the graph
