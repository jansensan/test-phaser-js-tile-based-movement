var gulp = require('gulp'),
    bowerFiles = require('main-bower-files');


// tasks
gulp.task('copy:vendors', copyVendorFiles);


// methods
function copyVendorFiles() {
  return gulp.src(bowerFiles(), {base: 'bower_components'})
    .pipe(gulp.dest('src/assets/js/vendors'));
}