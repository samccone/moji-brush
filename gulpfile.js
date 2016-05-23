var gulp = require("gulp");
var babel = require("gulp-babel");
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");

gulp.task("babelify", function () {
  return gulp.src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});

gulp.task('autoprefix', function () {
	return gulp.src('src/app.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['babelify', 'autoprefix'], function() {});
