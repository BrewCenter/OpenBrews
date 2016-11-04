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
  appJs: [
    './openbrews/**/*.js',
    '!./openbrews/karma.conf.js',
    '!./openbrews/lib/**',
    '!./openbrews/tests/**'
  ],
  js: [
     './openbrews/**/*.js',
    '!./openbrews/karma.conf.js',
    '!./openbrews/tests/**'
  ],
  static: [
    './openbrews/**/*',
    '!./openbrews/**/*.js',
    '!./openbrews/**/*.scss',
    '!./openbrews/tests',
    './openbrews/config.json',
    '!./openbrews/(example|manifest)*.json',
    '!./openbrews/karma.conf.js'
  ]
};

gulp.task('clean', function() {
  gulp.src('./www')
    .pipe(clean());
});

gulp.task('default', ['sass', 'js', 'static']);

gulp.task('jshint', [], function(done) {
  gulp.src(paths.appJs)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .on('end', done);
});

gulp.task('sass', function(done) {
  gulp.src('./openbrews/openbrews.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./openbrews/'))
    .pipe(gulp.dest('./www/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./openbrews/'))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('js', function(done) {
  gulp.src(paths.js)
      .pipe(gulp.dest('./www/'))
      .on('end', done);

});

gulp.task('static', function(done) {
  gulp.src(paths.static)
      .pipe(gulp.dest('./www/'))
      .on('end', done);
});

/* watchers */
gulp.task('watchSass', function() {
  gulp.watch(paths.sass, ['sass']);
});
gulp.task('watchJs', function() {
  gulp.watch(paths.js, ['js']);
});
gulp.task('watchStatic', function() {
  gulp.watch(paths.static, ['static']);
});
gulp.task('watch', ['watchSass', 'watchStatic', 'watchJs']);


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
