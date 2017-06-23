'use strict';

const util = require('util');
const promisify = require('./../util/promisify');
const path = require('path');
const rimraf = promisify(require('rimraf'));

describe('Image Processor Tests', () => {
  /* BEFORE AND AFTER TEST HOOKS */
  before(done => {
    rimraf(path.resolve(__dirname, 'temp'))
    .then(() => done())
    .catch(done);
  });

  after(done => {
    // rimraf(path.resolve(__dirname, 'temp'))
    // .then(() => done())
    // .catch(done);
    done();
  });

  /* REQUIRE TESTS */
  require('./resize');
});
