'use strict';

// DEPENDENCIES
const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const mime = require('mime');

module.exports = class {
  constructor(options) {
    this.options = options;
    aws.config.update({
      'accessKeyId': this.options.AWS.accessKey,
      'secretAccessKey': this.options.AWS.secretKey
    });
    this.s3 = new aws.S3();
  }

  multiple(sources, destination) {
    return new Promise((resolve, reject) => {
      let files = [];
      for (let source of sources) {
        files.push({
          source,
          destination: `${destination}/${path.basename(source)}`
        });
      }
      this.uploadMultiple(files)
      .then(response => resolve(response))
      .catch(error => reject(error));
    });
  };

  uploadMultiple(files, uploaded) {
    return new Promise((resolve, reject) => {
      if (!uploaded || uploaded.constructor !== Array) uploaded = [];
      if (files.length === 0) return resolve(uploaded);

      let file = files[0];
      this.single(file)
      .then(response => {
        uploaded.push(file);
        files.splice(0, 1);
        return this.uploadMultiple(files, uploaded);
      })
      .then(() => resolve())
      .catch(error => reject(error));
    });
  };

  single(file) {
    return new Promise((resolve, reject) => {
      if (!file.mimetype) file.mimetype = mime.lookup(file.source);
      fs.readFile(file.source, (error, data) => {
        if (error) return reject(error);
        this.s3.putObject({
          ACL: 'public-read',
          Bucket: this.options.AWS.S3.bucket,
          Key: file.destination,
          Body: data,
          ContentType: file.mimetype
        }, (error, data) => {
          if (error) return reject(error);
          resolve(data);
        });
      });
    });
  }
};
