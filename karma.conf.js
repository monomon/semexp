module.exports = function(config)
{
	config.set({
		frameworks : ['jasmine'],
		files : [
			'bower_components/d3/d3.min.js',
			'bower_components/semnet/semnet.js',
			'bower_components/autocomplete-0.3.0/autocomplete-0.3.0.js',
			'bower_components/jquery/dist/jquery.min.js',
			'src/js/semexp.js',
			'src/js/semexp.model.js',
			'src/js/semexp.cli.js',
			'src/js/semexp.graph.js',
			'src/js/semexp.menu.js',
			'src/js/semexp.tools.js',
			'test/*.js'
		]
	});
};