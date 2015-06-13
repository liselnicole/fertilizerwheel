module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: false
        },
        files: {
          "css/custom.css" : "css/custom.less"
        }
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
        files: ['js/custom.js']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch', 'less']);

};