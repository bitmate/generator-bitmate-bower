const gulp = require('gulp');
const browserSync = require('browser-sync');
const wiredep = require('wiredep').stream;
<% if (client === 'angular1') { -%>
const angularFilesort = require('gulp-angular-filesort');
<% } -%>
const gulpInject = require('gulp-inject');

const conf = require('../conf/gulp.conf');

gulp.task('inject', inject);

function inject() {
<% if (css === 'css') { -%>
  const injectStyles = gulp.src(conf.path.client('**/*.css'), {read: false});
<% } -%>
  const injectScripts = gulp.src([
    <% if (client === 'react') { -%>
    conf.path.tmp('**/!(app).js'),
    conf.path.tmp('**/app.js'),
    <% } else if (client === 'angular1') { -%>
    conf.path.tmp('**/*.js'),
    <% } -%>
    `!${conf.path.tmp('**/*.spec.js')}`
<% if (client === 'angular1') { -%>
  ])
  .pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));
<% } else { -%>
  ]);
<% } -%>

  const injectOptions = {
    ignorePath: [conf.paths.client, conf.paths.tmp],
    addRootSlash: false
  };

  return gulp.src(conf.path.client('index.html'))
<% if (css === 'css') { -%>
    .pipe(gulpInject(injectStyles, injectOptions))
<% } -%>
    .pipe(gulpInject(injectScripts, injectOptions))
    .pipe(wiredep(Object.assign({}, conf.wiredep)))
    .pipe(gulp.dest(conf.paths.tmp))
    .pipe(browserSync.stream());
}
