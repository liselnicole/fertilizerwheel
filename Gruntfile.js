module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: { //Compile Less file 
      development: {
        options: {
          compress: false
        },
        files: {
          "css/custom.css" : "css/custom.less"
        }
      }     
    },
    concat: {
      css: {
        src: ['css/simplotgray.css', 'css/jquery.mobile.structure-1.4.4.min.css', 'css/jquery.mobile.icons.min.css', 'css/custom.css'],
        dest: 'css/styles.concat.css'
      },
      js: {
        src: ['js/jquery-1.11.1.min.js', 'js/jquery.knob.js', 'js/support_vw_vh.js', 'js/custom.js', 'js/jquery.mobile-1.4.4.min.js'],
        dest: 'js/scripts.concat.js'
      }
    },
    version: {
      minor: {
        options: {
          release: 'minor'
        },
        src: ['package.json'] //Update version by minor increment
      },
      major: {
        options: {
          release: 'major'
        },
        src: ['package.json'] //Update version by major increment
      },
      update: {
        options: {
          prefix: 'version\\s+=\\s+[\'"]' //Look for "version="
        },
        src: ['config.xml'] //Replace in this file
      }
    },
    watch: {
      options: {
          livereload: 44444
        },
      html: {
        files: ['index.html']
      },
      css: {
        files: ['css/custom.less'],
        tasks: ['less']
      },
      js: {
        files: ['js/custom.js', 'js/support_vw_vh.js'],
        tasks: ['concat:js']
      }
    },
    cssmin: {
      target: {
        files: {
          'css/styles.concat.min.css': ['css/styles.concat.css']
        }
      }
    },
    replace: {
      index: {
        src: ['index.html'],
        dest: 'build/',  
        replacements: [{
            from: 'src="js/cordova.js"',
            to: 'src="phonegap.js"'
          }, 
          {
            from: 'css/styles.concat.css',
            to: 'css/styles.concat.min.css'
          }, 
          {
            from: '<script src="js/scripts.concat.js"></script>',
            to: '<script src="js/scripts.concat.min.js"></script>'
          }, 
          {
            from: '<script src="//localhost:44444/livereload.js"></script>',
            to: ''
          }
        ]
      },
      js: {
        src: ['js/scripts.concat.js'],
        dest: 'js/', 
        replacements: [{
            from: 'url: "http://simplot.sundoginteractive.com/services/best_products"', 
            to: 'url: "http://www.simplot.com/services/best_products"'
          },
          {
            from: 'url: "http://simplot.sundoginteractive.com/services/best_products"', 
            to: 'url: "http://www.simplot.com/services/best_products"'
          }
        ]
      }
    },
    uglify: {
      my_target: {
        files: {
          'build/js/scripts.concat.min.js': ['js/scripts.concat.js']
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['assets/**'], dest: 'build/'},
          {expand: true, src: ['css/fonts/**'], dest: 'build/'},
          {expand: true, src: ['css/images/**'], dest: 'build/'},
          {expand: true, src: ['css/styles.concat.min.css'], dest: 'build/'},
          {expand: true, src: ['img/*'], dest: 'build/'},
          {expand: true, src: ['templates/**'], dest: 'build/'},
          {expand: true, src: ['www/**'], dest: 'build/'},
          {expand: true, src: ['config.xml'], dest: 'build/'},
          {expand: true, src: ['icon.png'], dest: 'build/'},
          {expand: true, src: ['splash.png'], dest: 'build/'}
        ],
      },
    },
    compress: {
      main: {
        options: {
          archive: "build/build-<%= pkg.version %>.zip"
        },
        files: [
          { expand: true, src: ["**/*"], cwd: "build/" }
        ]
      }
    }


  });
  //DEV 
  //Compile Less
  grunt.loadNpmTasks('grunt-contrib-less');
  //Watch for Less file changes
  grunt.loadNpmTasks('grunt-contrib-watch');

  //Both
  //Concat css and js files and put them in respective bin folder
  grunt.loadNpmTasks('grunt-contrib-concat');

  //PRODUCTION BUILD 
  //Update build version in package.json file and in config.xml file
  grunt.loadNpmTasks('grunt-version');
  
  //Replace references where needed (js, css) in index.html and scripts.concat.js file and output them to the build dir
  grunt.loadNpmTasks('grunt-text-replace');
  
  //Minify css and js
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  //Copy files to build dir
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  //Zip build package up
  grunt.loadNpmTasks('grunt-contrib-compress');


  grunt.registerTask('default', ['less', 'concat']);

  grunt.registerTask('watchfiles', ['watch', 'less', 'concat']);

  grunt.registerTask('production', ['less', 'concat', 'cssmin', 'replace', 'uglify', 'copy', 'compress']);

};