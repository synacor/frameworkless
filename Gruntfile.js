module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			main : {
				files: {
					'dist/min/events.min.js': ['dist/events.js'],
					'dist/min/router.min.js': ['dist/router.js'],
					'dist/min/util.min.js': ['dist/util.js']
				}
			}
		},

		copy : {
			main : {
				expand : true,
				cwd : 'src/',
				src : '**',
				dest : 'dist/'
			},

			demo : {
				expand : true,
				cwd : 'src/',
				src : '**',
				dest : 'demo/js/lib/'
			},

			docs : {
				src : 'logo.png',
				dest : 'docs/logo.png'
			}
		},

		jshint : {
			options : {
				browser : true
			},
			main : [
				'src/**/*.js',
				'!src/test/**/*.js',
				'!src/demo/**/*.js'
			]
		},

		jsdoc : {
			main : {
				src: [
					'src/*.js',
					'README.md'
				],
				jsdoc : './node_modules/.bin/jsdoc',
				dest : 'docs',
				options : {
					configure : 'jsdoc.json'
				}
			}
		},

		mocha : {
			test : {
				options : {
					//log : true,
					//'remote-debugger-port' : 9001,
					//'remote-debugger-autorun' : 'yes',
					run : true,
					reporter : process.env.MOCHA_REPORTER || (process.env.ENVIRONMENT==='ci' ? 'XUnit' : 'Spec')
				},
				src : ['test/**/*.html'],
				dest : (process.env.ENVIRONMENT==='ci' || process.env.OUTPUT_TESTS) && './test-reports/default.xml'
			}
		},

		watch : {
			options : {
				interrupt : true
			},
			src : {
				files : [
					'src/**/*.js',
					'Gruntfile.js',
					'README.md',
					'jsdoc-template/**/*'
				],
				tasks : ['default']
			},
			test : {
				files : ['test/**/*'],
				tasks : ['test']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'jshint:main',
		'copy:main',
		'uglify:main',
		'copy:demo',
		'jsdoc:main',
		'copy:docs'
	]);

	grunt.registerTask('test', ['mocha:test'])

	grunt.registerTask('build-watch', [
		'default',
		'watch'
	]);

};
