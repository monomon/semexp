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
			beforeconcat : ['src/*.js']
		},
		uglify: {
			options : {
				banner : '/*\n<%= pkg.name %> <%= pkg.version %>\n<%= pkg.authors %>\n<%= grunt.template.today("yyyy-mm-dd") %>\n*/\n'
			},
			build : {
				src : [
					'src/semexp.js',
					'src/semexpgraph.js',
					'src/semexpmenu.js',
					'src/semexpmodel.js',
					'src/semexptools.js'
				],
				dest : 'build/semexp.min.js'
			}
		},
		// package for deployment
		copy: {
			build: {
				files: [{
					expand: true,
					flatten: true,
					src : ['src/demo.js'],
					dest : 'build/'
				}, {
					expand: true,
					flatten: true,
					src: [
						'bower_components/d3/d3.min.js',
						'bower_components/semnet/semnet.js'
					],
					dest: 'build/vendor/'
				}, {
					expand: true,
					src: ['style.css'],
					dest: 'dist'
				}, {
					expand: true,
					src: ['doc/**'],
					dest: 'dist'
				}]
			},

			dist : {
				files : [{
					expand : true,
					flatten : true,
					src : ['build/*.js'],
					dest : 'dist/js/'
				}, {
					expand: true,
					src: ['style.css'],
					dest: 'dist/css'
				}, {
					expand: true,
					flatten : true,
					src: ['build/vendor'],
					dest: 'dist/vendor'
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
				src : 'src/*.js',
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
		'karma',
		// 'jsdoc',
		'uglify',
		'processhtml:build'
	]);

	grunt.registerTask('dist', [
		'processhtml:dist',
		'copy:dist'
	]);
};
