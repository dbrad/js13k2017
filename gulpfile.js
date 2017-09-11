var fs           = require('fs');
var gulp         = require('gulp');
var htmlmin      = require('gulp-htmlmin');
var zip          = require('gulp-zip');
var cleanCSS     = require('gulp-clean-css');
var inlineBase64 = require('gulp-inline-base64');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var express      = require('express');
var path         = require('path');
var header       = require('gulp-header');
var footer       = require('gulp-footer');

gulp.task('minify:html', function () {
  return gulp.src('build/*.html')
    .pipe(htmlmin({ collapseWhitespace: true, removeAttributeQuotes: true, removeComments: true }))
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('uglify:js', function () {
  return gulp.src('build/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('wrap:js', function () {
  return gulp.src('build/temp/main.js')
    .pipe(header("window.onload=function(e){\n"))
    .pipe(footer("var audioCtx=new(window.AudioContext||window.webkitAudioContext)(); Game.i.init(window, document.getElementById('gameCanvas'), audioCtx);}"))
    .pipe(gulp.dest('build/'));
});

gulp.task('minify:css', function () {
  return gulp.src('build/*.css')
    .pipe(inlineBase64({ baseDir: 'src/' }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('minify:png', function () {
  return gulp.src('build/*.png')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('zip', ['minify:html', 'uglify:js', 'minify:css', 'minify:png'], function () {
  return gulp.src('dist/temp/*')
    .pipe(zip('js13k.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('report', ['zip'], function (done) {
  var stat = fs.statSync('dist/js13k.zip'),
    limit = 1024 * 13,
    size = stat.size,
    remaining = limit - size,
    percentage = (remaining / limit) * 100;

  percentage = Math.round(percentage * 100) / 100;

  console.log('\n\n-------------');
  console.log('BYTES USED: ' + stat.size);
  console.log('BYTES REMAINING: ' + remaining);
  console.log(percentage + '%');
  console.log('-------------\n\n');
  done();
});

gulp.task('serve', ['build'], function () {
  var htdocs = path.resolve(__dirname, 'build');
  var app = express();

  app.use(express.static(htdocs));
  app.listen(3000, function () {
    console.log("Server started on http://localhost:3000");
  });
});

gulp.task("build", ['minify:html', 'wrap:js', 'uglify:js', 'minify:css', 'minify:png', 'zip', 'report']);

gulp.task("watch", function () {
  gulp.watch('build/*.css', ['minify:css', 'zip', 'report']);
  gulp.watch('build/*.html', ['minify:html', 'zip', 'report']);
  gulp.watch('build/temp/*.js', ['wrap:js', 'uglify:js', 'zip', 'report']);
});

gulp.task('default', ['build', 'watch', 'serve']);
