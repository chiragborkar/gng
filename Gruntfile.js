// Generated on 2013-03-06 using generator-webapp 0.1.5
'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // load local tasks from /tasks/grunt folder
  grunt.loadNpmTasks('grunt-bless', 'grunt-devtools', 'grunt-contrib-concat');

  grunt.initConfig({
    watch: {
      compass: {
        files: ['sass/**/*.scss'],
        tasks: ['compass', 'bless:debug', ]
      },
      livereload: {
        files: ['inc/**/*.html', '*.html', 'css/*.css', 'js/**/*.js', 'img/**/*.{png,jpg,jpeg,webp}'],
        tasks: ['concat:dist']
      }
    },
    concat: {
      options: {
        stripBanners: false,
        separator: ';',
        banner: 'window.allJsTimeStamp = "<%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %>";'
      },
      dist: {
        src: [
          'js/lib/jquery.min.js',
          'js/foundation/app.js',
          'js/lib/respond.min.js',
          'js/lib/response.min.js',
          'js/lib/mediaelement-and-player.min.js',
          'js/lib/jquery.flexslider.js',
          'js/lib/jquery.tinyscrollbar.min.js',
          'js/lib/jquery.uniform.min.js',
          'js/lib/jquery.validate.js',
          'js/lib/jquery.truncator.js',
          'js/lib/typeahead.min.js',
          'js/lib/select.js',
          'js/lib/jquery.cookie.js',
          'js/lib/jquery.lazyload.min.js',
          'js/scripts.js',
          'js/header.js',
          'js/content-grid.js',
          'js/content-filter.js',
          'js/category-landing.js',
          'js/modules/errors.js',
          'js/home.js',
          'js/modules/bazaarvoice.js',
          'js/modules/article.js',
          'js/modules/modal.js',
          'js/modules/mixed-cart.js',
          'js/modules/mini-cart.js',
          'js/modules/tax-calculator.js',
          'js/modules/scene7.js',
          'js/lifestyle.js',
          'js/bundle-builder.js',
          'js/bundlebuilder/build.js',
          'js/product-detail.js',
          'js/search-results.js',
          'js/special-offers.js',
          'js/cart.js',
          'js/modules/cart-dd.js',
          'js/modules/errors.js',
          'js/checkout.js',
          'js/signin.js',
          'js/mls-ajax.js',
          'js/mls-ajax-sn-endpoints.js',
          'js/modules/compatibility.js',
	  'js/modules/home_compatibility.js',
	  'js/select2.js',
          'js/404.js',
          'js/content-landing.js',
          'js/util.js',
          'js/ui.js'
          ],

        dest: 'js/all-concat.js'
      }
    },

    uglify: {
      options: {
        mangle: true
      },
      my_target: {
        files: {
          'js/all.js': [
            'js/lib/jquery.min.js',
            'js/foundation/app.js',
            'js/lib/respond.min.js',
            'js/lib/response.min.js',
            'js/lib/mediaelement-and-player.min.js',
            'js/lib/jquery.flexslider.js',
            'js/lib/jquery.tinyscrollbar.min.js',
            'js/lib/jquery.uniform.min.js',
            'js/lib/jquery.validate.js',
            'js/lib/jquery.truncator.js',
            'js/lib/typeahead.min.js',
            'js/lib/select.js',
            'js/lib/jquery.cookie.js',
            'js/lib/jquery.lazyload.min.js',
            'js/scripts.js',
            'js/header.js',
            'js/content-grid.js',
            'js/content-filter.js',
            'js/category-landing.js',
            'js/modules/errors.js',
            'js/home.js',
            'js/modules/bazaarvoice.js',
            'js/modules/article.js',
            'js/modules/modal.js',
            'js/modules/mixed-cart.js',
            'js/modules/mini-cart.js',
            'js/modules/tax-calculator.js',
            'js/modules/scene7.js',
            'js/lifestyle.js',
            'js/bundle-builder.js',
            'js/bundlebuilder/build.js',
            'js/product-detail.js',
            'js/search-results.js',
            'js/special-offers.js',
            'js/cart.js',
            'js/modules/cart-dd.js',
            'js/modules/errors.js',
            'js/checkout.js',
            'js/signin.js',
            'js/mls-ajax.js',
            'js/mls-ajax-prod-endpoints.js',
            'js/modules/compatibility.js',
	    'js/modules/home_compatibility.js',
	    'js/select2.js',
            'js/404.js',
            'js/content-landing.js',
            'js/util.js',
            'js/ui.js'
          ]
        }
      }
    },



    connect: {
      options: {
        port: 8888,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost',
        base: ''
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
            mountFolder(connect, '')];
          }
        }
      },
      qa: {
        options: {
          middleware: function(connect) {
            return [
            mountFolder(connect, '.tmp'), mountFolder(connect, '')];
          }
        }
      },
      dist: {
        options: {
          middleware: function(connect) {
            return [
            mountFolder(connect, '')];
          }
        }
      }
    },
    open: {
      local: {
        path: 'http://localhost:<%= connect.options.port %>'
      },
      wiki: {
        path: 'https://bitbucket.org/CesarSapient/vzw-g-g-verizon-internal'
      }
    },
    clean: {
      all: ['.tmp', 'dist/*', 'dist/.*']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'js/{,*/}*.js']
    },
    bless: {
      options: {
        compress: true,
        cleanup: true,
        force: true,
        imports: false,
        cacheBuster: true
      },
      debug: {
        files: {
          'css/styles.css': ['css/styles.css']
        }
      }
    },
    compass: {
      options: {
        sassDir: 'sass',
        cssDir: 'css',
        imagesDir: 'img',
        javascriptsDir: 'js',
        fontsDir: 'fonts',
        relativeAssets: true
      },

      debug: {
        options: {
          debugInfo: false
        }
      }
    },
    imagemin: {
      all: {
        files: [{
          expand: true,
          cwd: 'img',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: 'images'
        }]
      }
    },

    recess: {
      dist: {
        options: {
            compress: true,             // Compress your compiled code
            noIDs: true,                 // Doesn't complain about using IDs in your stylesheets
            noJSPrefix: true,            // Doesn't complain about styling .js- prefixed classnames
            noOverqualifying: true,      // Doesn't complain about overqualified selectors (ie: div#foo.bar)
            noUnderscores: true,         // Doesn't complain about using underscores in your class names
            noUniversalSelectors: true,  // Doesn't complain about using the universal * selector
            prefixWhitespace: true,      // Adds whitespace prefix to line up vender prefixed properties
            strictPropertyOrder: true,   // Complains if not strict property order
            stripColors: false,          // Strip colors from the Terminal output
            // ^ Deprecated. Instead pass `--no-color` to grunt
            zeroUnits: true             // Doesn't complain if you add units to values of 0
        },
        files: one2one()
      }
    }

  });

  //returns one to one array for minifying blessed files 
  grunt.registerTask('one-to-one', function(){
    console.log(one2one());
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('build', 'Build task, 3 options: debug, dist, qa', function(target) {
    grunt.task.run(['clean']);

    if (target === 'debug') {
      return grunt.task.run(['compass', 'concat:dist', 'bless:debug',  'uglify', 'recess' ]);
    }



  });

  grunt.registerTask('optimize', 'Internal task used by `build` task', function(target) {
    if (target === 'debug' || target === 'qa') {
      return grunt.task.run(['compass', 'concat:dist', 'bless:debug', 'uglify', 'recess']);
    }

    if (target === 'dist') {
      return grunt.task.run(['concat:dist', 'bless:debug']);
    }
  });

  grunt.registerTask('server', 'Launch node server; 3 options: debug, dist, qa', function(target) {
    if (target === 'debug') {
      return grunt.task.run(['build:debug', 'livereload-start', 'connect:livereload', 'open:local', 'watch']);
    }

    if (target === 'dist') {
      return grunt.task.run(['build:dist', 'connect:dist:keepalive']);
    }

    if (target === 'qa') {
      return grunt.task.run(['build:qa', 'connect:qa', 'open:local', 'watch']);
    }
  });

  grunt.registerTask('default', ['open:wiki']);
  
};

function one2one(){
  var result = {};
  require('grunt').file.expand(['css/styles-blessed*.css', 'css/styles.css']).forEach(function(value, index){
    result[value] = value;
  });
  return result;
}
one2one();