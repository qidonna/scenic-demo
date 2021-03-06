/**
 * Copyright 2018 The Subscribe with Google Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const argv = require('minimist')(process.argv.slice(2));
const config = require('../config');
const eslint = require('gulp-eslint');
const gulp = require('gulp-help')(require('gulp'));
const gulpIf = require('gulp-if');
const lazypipe = require('lazypipe');
const colors = require('ansi-colors');
const log = require('fancy-log');
const watch = require('gulp-watch');

const isWatching = (argv.watch || argv.w) || false;

const options = {
  fix: false,
  plugins: ['eslint-plugin-google-camelcase'],
};

const watcher = lazypipe().pipe(watch, config.lintGlobs);

/**
 * Checks if current Vinyl file has been fixed by eslint.
 * @param {!Vinyl} file
 * @return {boolean}
 */
function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed;
}

/**
 * Run the eslinter on the src javascript and log the output
 * @return {!Stream} Readable stream
 */
function lint() {
  let errorsFound = false;
  let stream = gulp.src(config.lintGlobs);

  if (isWatching) {
    stream = stream.pipe(watcher());
  }

  if (argv.fix) {
    options.fix = true;
  }

  return stream.pipe(eslint(options))
      .pipe(eslint.formatEach('stylish', function(msg) {
        errorsFound = true;
        log(colors.red(msg));
      }))
      .pipe(gulpIf(isFixed, gulp.dest('.')))
      .pipe(eslint.failAfterError())
      .on('end', function() {
        if (errorsFound && !options.fix) {
          log(colors.blue('Run `gulp lint --fix` to automatically ' +
            'fix some of these lint warnings/errors. This is a destructive ' +
            'operation (operates on the file system) so please make sure ' +
            'you commit before running.'));
        }
      });
}


module.exports = {
  lint,
};

lint.description = 'Validates against Google Closure Linter';
lint.flags = {
  'watch': '  Watches for changes in files, validates against the linter',
  'fix': '  Fixes simple lint errors (spacing etc)',
};
