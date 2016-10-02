var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var jshint = require('gulp-jshint');

var paths = {
  sass: ['./openbrews/**/*.scss'],
  js: ['./openbrews/**/*.js', '!./openbrews/lib/**']
};

gulp.task('clean', function() {
  gulp.src('./dist')
    .pipe(clean());
});

gulp.task('default', ['sass', 'js', 'static']);

gulp.task('jshint', [], function(done) {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .on('end', done);
});

gulp.task('sass', function(done) {
  gulp.src('./openbrews/openbrews.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./openbrews/'))
    .pipe(gulp.dest('./dist/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./openbrews/'))
    .pipe(gulp.dest('./dist/'))
    .on('end', done);
});

gulp.task('js', function(done) {
  gulp.src('./openbrews/**/*.js')
      .pipe(gulp.dest('./dist/'))
      .on('end', done);

});

gulp.task('static', function(done) {
  gulp.src(['./openbrews/**/*','!./openbrews/**/*.js', '!./openbrews/**/*.scss'])
      .pipe(gulp.dest('./dist/'))
      .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass', 'js', 'static']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
