'use strict';

const bitmate = require('@oligibson/bitmate-generator');
const transforms = require('./transforms');

module.exports = bitmate.Base.extend({
  configuring: {
    pkg() {
      let dependencies = {};
      const devDependencies = {};

      const pkg = {
        devDependencies: {
          bower: '1.8.0',
          wiredep: '4.0.0',
          'gulp-inject': '4.2.0',
          'main-bower-files': '2.13.1'
        },
        scripts: {
          bower: 'bower'
        }
      };

      this.updateJson('bower.json', bower => {
        dependencies = bower.dependencies;
        return bower;
      });

      if (this.options.client === 'angular1') {
        pkg.devDependencies['gulp-angular-filesort'] = '1.1.1';
        devDependencies['angular-mocks'] = dependencies.angular;
      }

      if (this.options.js === 'typescript') {
        pkg.devDependencies['gulp-typescript'] = '^3.1.5';
      }

      this.mergeJson('package.json', pkg);

      this.mergeJson('bower.json', {
        name: 'bitmate-bower',
        version: '1.0.0',
        dependencies,
        devDependencies
      });
    }
  },

  writing: {
    transforms,

    gulp() {
      this.copyTemplate(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        {css: this.options.css}
      );
    },

    indexHtml() {
      this.replaceInFileWithTemplate(
        this.templatePath('conf/gulp.conf.js'),
        this.destinationPath('conf/gulp.conf.js'),
        /$/
      );

      this.replaceInFileWithTemplate(
        'src/index-head.html',
        'client/index.html',
        /<\/head>/
      );
      this.replaceInFileWithTemplate(
        'src/index-footer.html',
        'client/index.html',
        /<\/html>/
      );
    }
  },

  install() {
    this.runInstall('./node_modules/.bin/bower');
  }
});
