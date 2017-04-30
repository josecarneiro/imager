'use strict';

// DEPENDENCIES
const fs = require('fs');
const path = require('path');
const request = require('request');
const mkdirp = require('mkdirp');

// EXPORTS SINGLE
module.exports = class {
  constructor(options) {
    this.options = options;
  }

  single(data) {
    return new Promise((resolve, reject) => {
      request(data.source, { encoding: 'binary' }, (error, res, body) => {
        if (error || res.statusCode !== 200) return reject(error || new Error('Error transfering the file.'));
        mkdirp(path.join(this.options.base, data.destination), error => {
          if (error) return reject(error);
          let destination = path.join(this.options.base, data.destination, data.source.split('/')[data.source.split('/').length - 1]);
          fs.writeFile(destination, body, 'binary', error => {
            if (error) return reject(error);
            resolve(destination);
          });
        });
      });
    });
  }
};
