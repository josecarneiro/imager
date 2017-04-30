'use strict';

// DEPENDENCIES
const path = require('path');
const sharp = require('sharp');

// EXPORT
module.exports = class {
  constructor(options) {
    this.options = options;
  }

  single(data) {
    return new Promise((resolve, reject) => {
      let size = formatSize(data.size);
      if (!size) return reject('Wrong image size format.');
      let fileName = (size[0] === size[1] ? `${size[0]}.jpg` : `${size[0]}x${size[1]}.jpg`);
      let destination = path.join(this.options.base, data.destination, fileName);
      const image = sharp(data.source);
      image
      .metadata()
      .then(metadata => {
        // console.log(metadata);
        return image
        .resize(size[0], size[1])
        .crop(sharp.strategy.attention)
        .sharpen()
        .jpeg({
          quality: this.options.quality,
          progressive: this.options.progressive
        })
        .toFile(destination);
      })
      .then(() => resolve(destination))
      .catch(error => reject(error));
    });
  }

  multiple(data, paths) {
    return new Promise((resolve, reject) => {
      paths = paths || [];
      let size = data.sizes[0];
      this.single({
        source: data.source,
        destination: data.destination,
        size
      })
      .then(item => {
        paths.push(item);
        data.sizes.splice(0, 1);
        if (data.sizes.length) return this.multiple(data, paths);
        sharp.cache(false);
        return paths;
      })
      .then(paths => resolve(paths))
      .catch(error => reject(error));
    });
  }
};

function formatSize(size) {
  if (size instanceof Array) {
    if (size.length !== 2) return false;
    if (typeof size[0] === 'string' || typeof size[1] === 'string') {
      size[0] = parseInt(size[0], 10);
      size[1] = parseInt(size[1], 10);
    }
  } else {
    if (typeof size === 'number') {
      size = [ size, size ];
    } else if (typeof size === 'string') {
      let number = parseInt(size, 10);
      size = [ number, number ];
    } else {
      return false;
    }
  }
  // CHECK SIZE IS APPROPRIATE
  if (size[0] < 1 || size[0] > 2000 || size[1] < 1 || size[1] > 2000) return false;
  return size;
}
