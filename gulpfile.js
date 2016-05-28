var gulp = require('gulp');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var htmlMinifier = require('gulp-html-minifier');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babelify = require('babelify');

gulp.task('build-js-for-development', function () {
  return browserify('./source/js/app.jsx')
        .transform('babelify', { presets: ['react', 'es2015'] })
        .bundle()
        .pipe(vinylSourceStream('app.js'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('build-js-for-production', function () {
  return browserify('./source/js/app.jsx')
        .transform('babelify', { presets: ['react', 'es2015'] })
        .bundle()
        .pipe(vinylSourceStream('app.js'))
        .pipe(vinylBuffer())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('build-sass-for-development', function () {
  return gulp.src('./source/sass/main.scss')
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('build-sass-for-production', function () {
  return gulp.src('./source/sass/main.scss')
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('build-html-for-development', function () {
  return gulp.src('./source/*.html')
        .pipe(gulp.dest('./build'));
});

gulp.task('build-html-for-production', function () {
  return gulp.src('./source/*.html')
        .pipe(htmlMinifier({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch-for-development', function () {
  gulp.watch('./source/js/**/*.jsx', ['build-js-for-development']);
  gulp.watch('./source/js/**/*.js', ['build-js-for-development']);
  gulp.watch('./source/sass/**/*.scss', ['build-sass-for-development']);
  gulp.watch('./source/**/*.html', ['build-html-for-development']);
});

gulp.task('build-for-development', ['build-js-for-development', 'build-sass-for-development', 'build-html-for-development']);
gulp.task('build-for-production', ['build-js-for-production', 'build-sass-for-production', 'build-html-for-production']);

gulp.task('watch', ['build-for-development', 'watch-for-development']);
gulp.task('build', ['build-for-development']);

gulp.task('default', ['watch-for-development', 'build-for-development']);