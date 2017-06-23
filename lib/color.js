'use strict';

// DEPENDENCIES
const path = require('path');
const sharp = require('sharp');

// EXPORT
module.exports = class {
  constructor(options) {
    this.options = options;
  }

  color(data) {
    return new Promise((resolve, reject) => {
      let size = [3, 3];
      const image = sharp(data.source);
      image
      .resize(size[0], size[1])
      .crop(sharp.strategy.attention)
      .toBuffer()
      .then(data => {
        console.log(data);
        resolve();
      })
      .catch(reject);
    });
  }
};
