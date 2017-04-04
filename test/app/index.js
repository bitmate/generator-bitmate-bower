'use strict';

const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const _ = require('lodash');
const test = require('ava');
const Utils = require('@oligibson/bitmate-generator').TestUtils;

let context;
const pkg = {
  devDependencies: {
    'bower': '^1.7.9',
    'gulp-inject': '^3.0.0',
    'main-bower-files': '^2.9.0',
    'wiredep': '^4.0.0'
  },
  scripts: {
    bower: 'bower'
  }
};

const bower = {
  name: 'bitmate-bower',
  version: '1.0.0'
};

test.before(() => {
  context = Utils.mock('app');
  require('../../generators/app/index');
  process.chdir('../../');
});

test.beforeEach(() => {
  context.updateJson['package.json'] = {
    dependencies: {}
  };
  context.updateJson['bower.json'] = {
    dependencies: {}
  };
  context.copyTemplate.gulp_tasks = null; // eslint-disable-line camelcase
});

// test.only(`Get dependencies from 'bower.json'`, t => {
//   Utils.call(context, 'configuring.pkg', {client: 'angular1'});
//   t.deepEqual(context.updateJson['bower.json'], {});
// });

test(`Add 'gulp-angular-filesort' to package.json and set bower.json`, t => {
  const expectedPkg = _.merge(pkg, {
    devDependencies: {'gulp-angular-filesort': '^1.1.1'}
  });
  context.updateJson['bower.json'] = {
    dependencies: {angular: '^1.5.0'}
  };
  Utils.call(context, 'configuring.pkg', {client: 'angular1', js: 'js'});
  t.deepEqual(context.mergeJson['package.json'], expectedPkg);
  const expectedBower = _.merge(bower, {
    dependencies: {angular: '^1.5.0'},
    devDependencies: {'angular-mocks': '^1.5.0'}
  });
  t.deepEqual(context.mergeJson['bower.json'], expectedBower);
});

test(`Add 'gulp-typescript' to package.json and set bower.json`, t => {
  const expectedPkg = _.merge(pkg, {
    devDependencies: {'gulp-typescript': '^2.10.0'}
  });
  context.updateJson['bower.json'] = {
    dependencies: {angular: '^2.0.0-rc.3'}
  };
  Utils.call(context, 'configuring.pkg', {client: 'angular2', js: 'typescript'});
  t.deepEqual(context.mergeJson['package.json'], expectedPkg);
  const expectedBower = _.merge(bower, {
    dependencies: {angular: '^2.0.0-rc.3'}
  });
  t.deepEqual(context.mergeJson['bower.json'], expectedBower);
});

test(`Delete 'react-dom' from bower.json`, t => {
  context.updateJson['package.json'] = {
    dependencies: {'react-dom': '^1.0.0'}
  };
  Utils.call(context, 'configuring.pkg', {client: 'react'});
  t.deepEqual(context.mergeJson['bower.json'], bower);
});

test('Copy inject.js and scripts.js', t => {
  context.templatePath = path => path;
  context.destinationPath = path => path;
  Utils.call(context, 'writing.gulp');
  t.true(context.copyTemplate['gulp_tasks/inject.js'].length > 0);
  t.true(context.copyTemplate['gulp_tasks/scripts.js'].length > 0);
});

test('Call indexHtml 3 times', () => {
  context.templatePath = context.destinationPath = path => path;
  context.replaceInFileWithTemplate = () => {};
  const spy = chai.spy.on(context, 'replaceInFileWithTemplate');
  Utils.call(context, 'writing.indexHtml');
  expect(spy).to.have.been.called.exactly(3);
});

test('Call this.runInstall', () => {
  context.runInstall = () => {};
  const spy = chai.spy.on(context, 'runInstall');
  Utils.call(context, 'install');
  expect(spy).to.have.been.called.once();
});
