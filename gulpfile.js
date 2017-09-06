var gulp = require('gulp'),
  gulpConnect = require('gulp-connect'),
  gulpUglify = require('gulp-uglify'),
  gulpConcat = require('gulp-concat');


gulp.task('server', function (){
  gulpConnect.server({
    root: './app',
    livereload: true
  });
});

gulp.task('js', function () {
  gulp.src('./app/js/**/*.js')
    .pipe(gulpConcat('index.js'))
    .pipe(gulp.dest('./app'))
    .pipe(gulpConnect.reload());
});

gulp.task('watch', function () {
  gulp.watch('./app/js/**/*.js', ['js']);
});

gulp.task('default', ['server', 'watch']);