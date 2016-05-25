var gulp = require('gulp');
var babel = require('gulp-babel');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var replace = require('gulp-replace');

gulp.task('babelify', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  var processors = [
    autoprefixer({browsers: ['last 2 versions']}),
    cssnano(),
];
	return gulp.src('src/app.css')
    .pipe(postcss(processors))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src(['src/images/**', '!**/.DS_Store'])
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('html', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('vendor', function () {
  return gulp.src('src/vendor/**')
    .pipe(gulp.dest('dist/vendor'));
});

gulp.task('default', ['babelify', 'css', 'images', 'html', 'vendor'], function() {});
