var fs           = require('fs');
var gulp         = require('gulp');
var htmlmin      = require('gulp-htmlmin');
var zip          = require('gulp-zip');
var cleanCSS     = require('gulp-clean-css');
var inlineBase64 = require('gulp-inline-base64');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');

gulp.task('minify:html', function () {
  return gulp.src('build/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('uglify:js', function () {
  return gulp.src('build/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('minify:css', function () {
  return gulp.src('src/*.css')
    .pipe(inlineBase64({ baseDir: 'src/' }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('build'));
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

gulp.task("watch", function () {
  gulp.watch('build/*.css', ['minify:css', 'zip', 'report']);
  gulp.watch('build/*.html', ['minify:html', 'zip', 'report']);
  gulp.watch('build/js/*.js', ['uglify:js', 'zip', 'report']);
});

gulp.task('default', ['minify:html', 'uglify:js', 'minify:css', 'minify:png', 'zip', 'report', 'watch']);
