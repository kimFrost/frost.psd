/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		banner: '',
		// Task configuration.
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			head: {
				src: ['js/libs/modernizr.js',
					'js/libs/respond.js',
					'js/libs/console.js',
					'js/libs/json2.js',
					'js/libs/namespaces.js',
                    'js/libs/jquery-1.9.1.js',
                    'js/libs/angular.min.js'],
				dest: '../scripts/head.js'
			},
			app: {
				src: [
					'js/libs/jquery.debounce.js',
					'js/Angular.LazyAss.js',
					'js/Angular.Layout.LazyAss.js'
				],
				dest: '../scripts/LazyAss.js'
			}
		},
		uglify: {
			head: {
				src: '<%= concat.head.dest %>',
				dest: '../scripts/head.min.js'
			},
			app: {
				src: '<%= concat.app.dest %>',
				dest: '../scripts/LazyAss.min.js'
			}
		},
		compass: {
			dist: {
				options: {
					config: 'config.rb'
				}
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: '../css/',
				src: ['*.css', '!*.min.css', '!Icon*.css'],
				dest: '../css/',
				ext: '.min.css'
			}
		},
		copy: {
			main: {
				files: [
					{ expand: true, cwd: 'img/', src: ['**', '!**/*.db', '!*.db'], dest: '../img/' },
					{ expand: true, cwd: 'fonts/', src: ['**'], dest: '../fonts/' },
					{ expand: true, cwd: 'icons/', src: ['*.svg', '*.eot', '*.woff', '*.ttf'], dest: '../fonts/' }
				]
			}
		},
		watch: {
			scripts: {
				files: ['<%= concat.app.src %>',
					'<%= concat.head.src %>',
					'scss/**',
					'scss/**/*',
					'img/**',
					'img/**/*'],
				tasks: ['concat', 'copy', 'compass']
			},
			jade: {
				files: [
					"views/*.jade"
				],
				tasks: "jade"
			}
		},
		jade: {
			compile: {
				options: {
					pretty: true,
					data: {
						debug: false
					}
				},
				files: {
					"index.html": ["views/index.jade"],
					"styleguide.html": ["views/styleguide.jade"],
					"index_shadows.html": ["views/index_shadows.jade"],
					"theme_guide.html": ["views/theme_guide.jade"]
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jade');
	// Default task.
	grunt.registerTask('default', ['concat', 'uglify', 'copy', 'compass', 'cssmin', 'jade']);
	grunt.registerTask('dev', ['concat', 'copy', 'compass', 'jade', 'watch']);
};