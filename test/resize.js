'use strict';

const Editor = require('./../.');

/* EASY ID TESTS */
describe('Resize Images', () => {
  
  it('Should resize to one size', done => {
    const editor = new Editor({
      base: './test/temp/.',
      debug: true
    });
    editor.single({
      source: './../data/1/image.jpg',
      destination: './1',
      size: 250
    })
    .then(() => done())
    .catch(done);
  });

  it('Should resize to multiple sizes', done => {
    const editor = new Editor({
      base: './test/temp/.',
      debug: true
    });
    editor.multiple({
      source: './../data/2/image.jpg',
      destination: './2',
      sizes: [ 32, 64, 128, 256, 512, [ 1000, 1400 ] ]
    })
    .then(() => done())
    .catch(done);
  });

});
