semexp
======

A semantic graph editing tool

![screenshot](http://monomon.me/semexp/images/semexp.png)
[live demo](http://monomon.me/semexp/)

#Usage#
```
var explorer = Object.create(window.semexp);
explorer.init({
	width : 800,
	height : 600
});

explorer.load(data);

explorer.addNode('harp');
explorer.addLink('harp', 'isA', 'chordophone');
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

getData({
	method : 'GET',
	url : 'localhost'
});
```
	
#Dependencies#
* [semnet](https://github.com/asciimoo/semnet) semantic network implementation
* [d3](https://github.com/mbostock/d3) visualization library
