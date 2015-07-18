var gulp = require('gulp');
var react = require('gulp-react');

gulp.task('react', function() {
  gulp.src('themes/default/public/jsx/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('themes/default/public/js/'))
});

gulp.task('watch', function() {
  gulp.watch('themes/**/*', ['build']);
});

gulp.task('build', ['react']);

gulp.task('default', ['react', 'watch']);