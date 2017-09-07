/**
 * Easy creation of the polygons.
 *
 * @package create-polygon
 * @author Dmitry Kaplin <dmitry.kaplin@bigdropinc.com>
 */
import path from "path";
import gulp from "gulp";
import gulpConnect from "gulp-connect";
import browserify from "browserify";
import babelify from "babelify";
import source from "vinyl-source-stream";
import gulpUglify from "gulp-uglify";
import gulpStreamify from "gulp-streamify";

const outputJsFileName = 'app.js';

const paths = {
  app: path.join(__dirname, 'app'),
  js: path.join(__dirname, 'app/js'),
  allJs: path.join(__dirname, 'app/js/**/*.js')
};

gulp.task('server', () => {
  gulpConnect.server({
    root: paths.app,
    livereload: true
  });
});

gulp.task('js', () => {
  browserify({
      entries: path.join(paths.js, 'index.js'),
      paths: [paths.js]
    })
    .transform(babelify)
    .bundle()
    .pipe(source(outputJsFileName))
    .pipe(gulpStreamify(gulpUglify()))
    .pipe(gulp.dest(paths.app))
    .pipe(gulpConnect.reload());

});

gulp.task('watch', () => {
  gulp.watch(paths.allJs, ['js']);
});

gulp.task('default', ['js', 'server', 'watch']);