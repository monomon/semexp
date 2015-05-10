module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
		jshint : {
			options : {
				'-W004' : true,
				'-W097' : true,
				globals : {
					'$' : true,
					'semexp' : true,
					'requestAnimationFrame' : true,
					'cancelAnimationFrame' : true,
					'WeakMap' : true,
					'document' : true,
				}
			},
			beforeconcat : ['src/js/*.js']
		},
		uglify: {
			options : {
				banner : '/*\n<%= pkg.name %> <%= pkg.version %>\n<%= pkg.authors %>\n<%= grunt.template.today("yyyy-mm-dd") %>\n*/\n'
			},
			build : {
				src : [
					'src/js/semexp.js',
					'src/js/semexpgraph.js',
					'src/js/semexpmenu.js',
					'src/js/semexpmodel.js',
					'src/js/semexptools.js'
				],
				dest : 'build/js/semexp.min.js'
			}
		},
		// package for deployment
		copy: {
			build: {
				files: [{
					expand: true,
					flatten: true,
					src : ['src/js/demo.js'],
					dest : 'build/js/'
				}, {
					expand: true,
					flatten: true,
					src: ['src/style.css'],
					dest: 'build/'
				}]
			},

			dist : {
				files : [{
					expand : true,
					flatten : true,
					src : ['build/js/*'],
					dest : 'dist/js/'
				}, {
					expand: true,
					flatten: true,
					src: ['build/style.css'],
					dest: 'dist/'
				}, {
					expand: true,
					flatten: true,
					src: [
						'bower_components/d3/d3.min.js',
						'bower_components/semnet/semnet.js'
					],
					dest: 'dist/vendor/'
				}]
			}
		},

		clean: {
			build : ['build'],
			dist : ['dist'],
			doc : ['doc']
		},

		jsdoc : {
			default : {
				src : 'src/js/*.js',
				dest : 'doc'
			}
		},

		karma : {
			default : {
				options : {
					configFile : 'karma.conf.js',
					browsers : ['Firefox'] // svg doesn't work in PhantomJS
				}
			}
		},

		processhtml : {
			build : {
				files : {
					'build/index.html' : ['src/index.html']
				}
			},
			dist : {
				files : {
					'dist/index.html' : ['build/index.html']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-processhtml');

	grunt.registerTask('build', [
		'jshint:beforeconcat',
		// 'karma',
		// 'jsdoc',
		'copy:build',
		'uglify',
		'processhtml:build'
	]);

	grunt.registerTask('dist', [
		'processhtml:dist',
		'copy:dist'
	]);
};