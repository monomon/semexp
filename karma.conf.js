module.exports = function(config)
{
	config.set({
	frameworks : ['jasmine'],
		files : [
			'bower_components/d3/d3.min.js',
			'bower_components/semnet/semnet.js',
			'src/js/*.js',
			'test/*.js'
		]
	});
};