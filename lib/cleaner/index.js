'use strict';

// DEPENDENCIES
const fs = require('fs');
const path = require('path');

// EXPORTS
module.exports = class {
  constructor(options) {
    this.options = options;
  };

  directory(directory) {
    return new Promise((resolve, reject) => {
      if (this.options.skip) return resolve();
      if (this.options.base) directory = path.join(this.options.base, directory);
      fs.readdir(directory, (error, files) => {
        if (error) return reject(error);
        if (!files.length) {
          fs.rmdir(directory, error => {
            if (error) return reject(error);
            resolve();
          });
        } else {
          for (let i = 0; i < files.length; i++) {
            files[i] = path.resolve(directory, files[i]);
          }
          this.multiple(files)
          .then(() => {
            fs.rmdir(directory, (error) => {
              if (error) return reject(error);
              resolve();
            });
          })
          .catch(error => reject(error));
        }
      });
    });
  };

  multiple(files) {
    return new Promise((resolve, reject) => {
      if (!files.length) return resolve();
      let file = files[0];
      this.single(file)
      .then(() => {
        files.splice(0, 1);
        return this.multiple(files);
      })
      .then(() => resolve())
      .catch(error => reject(error));
    });
  };

  single(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (error, result) => {
        if (error) return reject(error);
        resolve();
      });
    });
  };
};
