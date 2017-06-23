'use strict';

// DEPENDENCIES
var gm = require('gm');

// EXPORTS
module.exports = function(options, callback) {
  gm(options.path)
  .resize(3,3)
  .toBuffer('GIF', function(err, buffer) {
    if(err) return callback(err);
    return callback(null, buffer.toString('base64'));
  });
};
