// include gulp and plugins
var gulp = require('gulp'),
    requireDir = require('require-dir');


// require tasks directory
requireDir('./lib/tasks', {recurse: true});


/**
 *  Main Tasks
 */
gulp.task('build', ['dev:build']);
gulp.task('dev', ['serve:dev']);


/**
 *  Development Sub Tasks
 */
gulp.task('dev:build', [
  'copy:vendors'
]);