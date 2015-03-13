// include gulp and plugins
var gulp = require('gulp'),
    webserver = require('gulp-webserver');


// tasks
gulp.task('serve:dev', serveDev);


// methods
function serveDev() {
  return gulp.src('src')
    .pipe(webserver({
      livereload: true,
      host: 'phaser-js-test.com',
      port: 6400,
      fallback: 'index.html',
      open: true
    }));
}