'use strict';

const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const spawn = require('cross-spawn');
const excludeGitignore = require('gulp-exclude-gitignore');
const nsp = require('gulp-nsp');

gulp.task('nsp', nodeSecurityProtocol);
gulp.task('watch', watch);
gulp.task('static', eslintCheck);
gulp.task('test', gulp.series([avaTest, nycReport, nycCheck]));

gulp.task('prepublish', gulp.series('nsp'));
gulp.task('default', gulp.series('static', 'test'));

function nodeSecurityProtocol(cb) {
  nsp({package: path.resolve('package.json')}, cb);
}

function eslintCheck() {
  return gulp.src(['**/*.js', '!**/templates/**', '!test/assets/**'])
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function avaTest() {
  return spawn('./node_modules/.bin/nyc', ['--all', '--reporter=lcov', './node_modules/.bin/ava'], {stdio: 'inherit'});
}

function nycReport() {
  return spawn('./node_modules/.bin/nyc', ['report', '--colors'], {stdio: 'inherit'});
}

function nycCheck() {
  return spawn('./node_modules/.bin/nyc', ['check-coverage', '--lines=100', '--functions=100', '--branches=100', '--statements=100'], {stdio: 'inherit'});
}

function watch() {
  return spawn('./node_modules/.bin/nyc', ['--all', '--reporter=lcov', './node_modules/.bin/ava', '--watch'], {stdio: 'inherit'});
}
