/*!
 * fs-read-queue <https://github.com/doowb/fs-read-queue>
 *
 * Inspired by this pull request: https://github.com/tj/consolidate.js/pull/171
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');

var reading = {};
var queue = {};

/**
 * File reading function that will queue up calls to `fs.readFile` for the same filepath to
 * prevent `ENFILE` errors.
 *
 * ```js
 * fsq('path/to/my/file', function (err, contents) {
 *   if (err) return console.error(err);
 *   console.log(contents);
 * });
 * ```
 *
 * @param  {String} `fp` File path to read
 * @param  {String} `options` Additional options to pass to `fs.readFile`
 * @param  {Function} `cb` Callback function that takes `err` and `contents` parameters. Will be called when the file is read.
 * @api public
 * @name  readFile
 */

module.exports = function readFile (fp, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }

  if (reading[fp]) {
    if (!queue[fp]) queue[fp] = [cb];
    else queue[fp].push(cb);
  } else {
    reading[fp] = true;
    fs.readFile(fp, options, function (err, contents) {
      if (err) return cb(err);
      reading[fp] = false;
      if (queue[fp]) {
        queue[fp].forEach(function (cb) {
          cb(null, contents);
        });
        queue[fp] = null;
      }
      cb(null, contents);
    });
  }
};
