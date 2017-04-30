'use strict';

// DEPENDENCIES
var gm = require('gm');

// EXPORTS
module.exports = function(options, callback) {
  gm(options.path)
  .resize(250, 250)
  .colors(1)
  .toBuffer('RGB', function(err, buffer) {
    if(err) return callback(err);
    var rgb = buffer.slice(0, 3);
    var hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    return callback(null, hex);
  });
};

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
