'use strict';

var assert = require('assert');
var async = require('async');
var glob = require('globby');
var read = require('..');
var fs = require('fs');

var max = 1000, i, arr;

describe('fs-read-queue', function () {
  beforeEach(function () {
    i = -1;
    arr = new Array(max);
    while (++i < max) arr[i] = i;
  });

  it('should fail read files with normal fs module', function (done) {
    glob('test/fixtures/*.txt', function (err, files) {
      if (err) return done(err);
      async.each(arr, function (i, next) {
        async.each(files, function (fp, cb) {
          fs.readFile(fp, cb);
        }, next);
      }, function (err) {
        if (!err) return done(new Error('Expected to get an ENFILE error'));
        if (err.code !== 'ENFILE') return done(new Error('Expected to get an ENFILE error, but got', err));
        done();
      });
    });
  });

  it('should success reading files with fs-read-queue module', function (done) {
    glob('test/fixtures/*.txt', function (err, files) {
      if (err) return done(err);
      async.each(arr, function (i, next) {
        async.each(files, function (fp, cb) {
          read(fp, cb);
        }, next);
      }, done);
    });
  });
});
