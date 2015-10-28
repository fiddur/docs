var gulp = require('gulp');
var stylus = require('gulp-stylus');
var react = require('gulp-react');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('react', function() {
  gulp.src('public/jsx/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('public/js/'))
});

gulp.task('styles', function() {
  gulp.src('public/css/docs.styl')
    .pipe(stylus({
      'include css': true,
      compress: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('watch', function() {
  gulp.watch('public/**/*', ['build']);
});

gulp.task('build', ['react', 'styles']);
gulp.task('default', ['build', 'watch']);
