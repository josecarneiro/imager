'use strict';

// DEPENDENCIES
const version = require('./../package').version;
const path = require('path');
const util = require('util');
const promisify = require('./../util/promisify');
const mkdirp = promisify(require('mkdirp'));
const sharp = require('sharp');
// const UtilColor = require('./../../util/color');
const utilSize = require('./../util/size');

// EXPORT
class Editor {
  constructor(options) {
    this._defaults = {
      debug: process.env.NODE_ENV === 'development',
      progressive: true,
      quality: 100
    };
    this.options = Object.assign(this._defaults, options);
    this._version = version;
    this._isGCFunction = !!process.env.FUNCTION_NAME;
    this.debug(`Running version ${this._version}.`);
    this.debug(`Running on ${this._isGCFunction ? 'GC Function' : 'normal'} mode.`);
  }

  get version() {
    return this._version;
  }

  debug(...args) {
    if (this.options.debug) {
      for (let data of args) {
        if (data instanceof Error) {
          console.error(data);
        } else if (typeof data === 'object') {
          console.log(util.inspect(data, { colors: true }));
        } else {
          console.log(data);
        }
      }
    }
  }

  single(data) {
    return new Promise((resolve, reject) => {
      let size = utilSize.format(data.size);
      if (!size) return reject(new Error('Didn\'t provide size.'));
      let fileName = (size[0] === size[1] ? `${size[0]}.jpg` : `${size[0]}x${size[1]}.jpg`);
      let source = path.join(this.options.base, data.source);
      let destination = path.join(this.options.base, data.destination, fileName);
      this.debug(size, fileName, source, destination);

      let image;

      mkdirp(path.join(this.options.base, data.destination))
      .then(() => {
        image = sharp(source);
        return image.metadata();
      })
      .then(metadata => {
        this.debug(metadata);
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
      .catch(reject);
    });
  };

  multiple(data) {
    return new Promise((resolve, reject) => {
      let items = [];
      for (let size of data.sizes) {
        items.push({
          source: data.source,
          destination: data.destination,
          size
        });
      }
      Promise.all(items.map(this.single, this))
      .then(paths => resolve(paths))
      .catch(reject);
    });
  }

  color(data) {
    return new Promise((resolve, reject) => {
      let size = [3, 3];
      const image = sharp(data.source);
      image
      .resize(size[0], size[1])
      // .crop(sharp.strategy.attention)
      .jpeg({
        quality: 10
      })
      .toBuffer()
      .then(buffer => {
        const getPixels = require('get-pixels');
        getPixels(buffer, 'image/jpeg', (error, pixels) => {
          if (error) console.log(error);
          let img = [];
          let data = pixels.data;
          console.log(data);
          for (let i = 0; i < data.length - 1; i = i + 4) {
            console.log(data[i]);
            img.push([data[i], data[(i + 1)], data[(i + 2)]]);
          }
          console.log(img);
        });
        resolve();
      })
      .catch(reject);
    });
  }
};

module.exports = Editor;
