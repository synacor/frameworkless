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
			}
		},

		jshint : {
			options : {
				browser : true
			},
			main : [
				'src/**/*.js'
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
					run : true,
					reporter : process.env.MOCHA_REPORTER || (process.env.ENVIRONMENT==='ci' ? 'XUnit' : 'Spec'),
					urls : [
						'test/index.html'
					],
					dest: './test-reports/default.xml'
				}
			}
		},

		watch : {
			options : {
				interrupt : true
			},
			src : {
				files : ['src/**/*.js'],
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
		'jsdoc:main'
	]);

	grunt.registerTask('test', ['mocha:test'])

	grunt.registerTask('build-watch', [
		'default',
		'watch'
	]);

};
