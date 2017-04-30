'use strict';

/* DEPENDENCIES */
const Downloader = require('./downloader');
const Editor = require('./editor');
const Uploader = require('./uploader');
const Cleaner = require('./cleaner');

/* DECLARE IMAGER CLASS */
const Imager = class {
  constructor(options) {
    this.options = options;
    this.downloader = new Downloader({
      base: this.options.tempFolder
    });
    this.uploader = new Uploader({
      base: this.options.tempFolder,
      AWS: this.options.AWS
    });
    this.editor = new Editor({
      base: this.options.tempFolder,
      quality: 100,
      progressive: true
    });
    this.cleaner = new Cleaner({
      base: this.options.tempFolder,
      skip: true
    });
  }

  edit(data) {
    return new Promise((resolve, reject) => {
      this.downloader.single({
        source: data.source,
        destination: data.media
      })
      .then(source => {
        return this.editor.multiple({
          source,
          destination: data.media,
          sizes: data.sizes
        });
      })
      .then(paths => this.uploader.multiple(paths, data.destination))
      .then(() => this.cleaner.directory(data.media))
      .then(() => resolve())
      .catch(error => reject(error));
    });
  }
};

/* EXPORT IMAGER CLASS */
module.exports = Imager;
