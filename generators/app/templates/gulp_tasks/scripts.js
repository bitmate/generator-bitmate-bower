const gulp = require('gulp');
<% if (js === 'babel' || client === 'react' && js === 'js') { -%>
const babel = require('gulp-babel');
<% } -%>
const conf = require('../conf/gulp.conf');

gulp.task('scripts', scripts);

function scripts() {
  return gulp.src([conf.path.client('**/*.js'), `!${conf.path.client('bower_components/**/*')}`])
<% if (js === 'babel' || client === 'react' && js === 'js') { -%>
    .pipe(babel())
<% } -%>
    .pipe(gulp.dest(conf.path.tmp()));
}
