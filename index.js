/*!
 * fs-read-queue <https://github.com/doowb/fs-read-queue>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');

var reading = {};
var queue = {};

module.exports = function read (fp, options, cb) {
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
