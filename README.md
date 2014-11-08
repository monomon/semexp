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
var explorer = Object.create(window.semexp)...
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
* [semnet](https://github.com/asciimoo/semnet) semantic network implementation
* [d3](https://github.com/mbostock/d3) visualization library
