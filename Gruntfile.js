var module;
module.exports = function(grunt) {

	grunt.initConfig({
		cfg: {
            filename: 'jquery.tableau',
            vanillaExportName: 'jquery.tableau'
        },
		dirs: {
            src: 'src',
            dist: 'dist',
            docs: 'docs',
            test: 'test',
			libs: 'libs',
			css: 'css',
            examples: 'examples'
        },
		copy: {
            main: {
                expand: true,
				cwd:'<%= dirs.src %>/',
                src: ['**'],
                dest: '<%= dirs.dist %>/',
            },
			css: {
                expand: true,
				cwd:'<%= dirs.src %>/css',
                src: ['**'],
                dest: '<%= dirs.dist %>/css',
            },
			examples: {
                expand: true,
                src: ['<%= dirs.libs %>/**', '<%= dirs.dist %>/**'],
                dest: '<%= dirs.examples %>/',
            },
			test: {
                expand: true,
                src: ['<%= dirs.libs %>/**', '<%= dirs.dist %>/**'],
                dest: '<%= dirs.test %>/',
            }
        },
		clean: {
            all: ['<%= dirs.dist %>/**']
        },
		karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
		requirejs: {
            dist: {
                options: {
                    baseUrl: "./",
                    appDir: "src/js",
                    mainConfigFile: ["src/js/app-config.js"],
                    dir: "dist/js",
                    skipDirOptimize: false,
                    removeCombined: true,
                    optimize: 'none',
                    modules: [
						{
							name: "jquery.tableau",
							exclude: ["jquery","jquery-ui","tableau"],
						},
						{
							name: "tableau-manager",
							exclude: ["jquery","jquery-ui","tableau"],
						}
					]
                }
            },
		},
		"watch": {
			"files": "<%= dirs.src %>/**",
			"tasks": ["default"]
		},
		
	});

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-karma');
  
  grunt.registerTask('dist', ['clean:all','requirejs:dist', 'copy:css']);
  grunt.registerTask('default', ['dist','copy:examples', 'copy:test']);
  
  
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('w', ['watch']);
 
};