var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var fs = require('node-fs');
var fse = require('fs-extra');
var json = require('json-file');


var themeName = json.read('./package.json').get('themeName');
var themeDir = '../' + themeName;

//error notification settings for plumber
var plumberErrorHandler = { errorHandler: notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
  })
};


gulp.task('sass', function () {
  gulp.src('./css/src/*.scss')
    .pipe(plumber(plumberErrorHandler))
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(livereload());
});


gulp.task('js', function () {
  gulp.src('./js/src/*.js')
    .pipe(plumber(plumberErrorHandler))
    .pipe(jshint())
    .pipe(jshint.reporter('fail'))
    .pipe(concat('theme.js'))
    .pipe(gulp.dest('./js'))
    .pipe(livereload());
});


gulp.task('img', function() {
  gulp.src('./img/src/*')
    .pipe(plumber(plumberErrorHandler))
    .pipe(imagemin({
      optimizationLevel: 7,
      progressive: true
    }))
    .pipe(gulp.dest('./img'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  // live reload listen
  livereload.listen();
  // Watch SCSS changes.
  gulp.watch('css/src/*.scss', ['sass']);
  // Watch js changes.
  gulp.watch('js/src/*.js', ['js']);
  // Watch image changes.
  gulp.watch('img/src/*.{png,jpg,gif}', ['img']);
});


// create skeleton directory structure
gulp.task('init', function() {
  fs.mkdirSync(themeDir, 0765, true);
  fse.copySync('theme-boilerplate', themeDir + '/');
});

gulp.task('default', ['sass', 'js', 'img', 'watch']);
