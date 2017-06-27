// 1 declare all the variables.
var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var buildProduction = utilities.env.production;
var del = require('del');
var jshint = require('gulp-jshint'); //to use linting, correct sintax
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var lib = require('bower-files')();
// USE THIS INSTEAD FOR LIB IF YOU INSTALL BOOTSTRAP
// var lib = require('bower-files')({
//   "overrides":{
//     "bootstrap" : {
//       "main": [
//         "less/bootstrap.less",
//         "dist/css/bootstrap.css",
//         "dist/js/bootstrap.js"
//       ]
//     }
//   }
// });

//2 runs separately from the chain
gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//3 defines task concatInterface , all the files *interface in temp folder.
gulp.task('concatInterface', function() {
  return gulp.src(['./js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

//4 makes files ready for browser
gulp.task('jsBrowserify', ['concatInterface'], function(){
  return browserify({ entries: ['./tmp/allConcat.js'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

//5 Minifying compresses scripts.
gulp.task('minifyScripts', ['jsBrowserify'], function() {
  return gulp.src('./build/js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

//6 place downloaded with bower js files in build.js
gulp.task('bowerJS', function() {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

//7 place downloaded with bower css files in build/vendor.css
gulp.task('bowerCSS', function() {
  return gulp.src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
});

//8 chain bower tasks together
gulp.task('bower', ['bowerJS', 'bowerCSS']);

//9 Remove previous tmp and build files prior to rebuilding
gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

gulp.task("build",['clean'], function(){
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
  gulp.start('bower');
  gulp.start('cssBuild');
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });

  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(["scss/**/*.scss"], ['cssBuild']);
  gulp.watch(['*.html'], ['htmlBuild']);
});

gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

gulp.task('cssBuild', function() {
  return gulp.src(['scss/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('htmlBuild', function() {
  browserSync.reload();
});
