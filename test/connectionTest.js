'use strict';

let expect = require("chai").expect;
let fs = require('fs');
let web = require('../src/web');
let cpen = require('../src/cpen');

describe('download test', () => {

  afterEach((done) => {
    fs.unlinkSync('example/index.html');
    fs.unlinkSync('example/style.css');
    fs.unlinkSync('example/main.js');
    fs.rmdirSync('example');
    done();
  })

  it('should download files to example folder', (done) => {
    cpen.download('https://codepen.io/ge1doot/pen/aNVYPN', 'example',
      (err) => {
        expect(err).to.be.null;
        done();
      },
      {
        targetFiles : ['html', 'css', 'js'],
        includeDependencies : true
      },
      () =>  console.log('Tick!'));
  });

  it('should download files to example folder, no ticks', (done) => {
    cpen.download('https://codepen.io/ge1doot/pen/aNVYPN', 'example',
      (err) => {
        expect(err).to.be.null;
        done();
      },
      {
        targetFiles : ['html', 'css', 'js'],
        includeDependencies : true
      });
  });

  it('should download files to example folder, no ticks, no options', (done) => {
    cpen.download('https://codepen.io/ge1doot/pen/aNVYPN', 'example',
      (err) => {
        expect(err).to.be.null;
        done();
      });
  });

});

describe('web scraping test', () => {

  it('should return external JS resources', (done) => {
    web.getPenProperties('https://codepen.io/zadvorsky/pen/VaXqRW', (err, data) => {
      expect(err).to.be.null;
      expect(data.resources[0].url).to.be.eql("https://cdnjs.cloudflare.com/ajax/libs/three.js/r62/three.min.js");
      expect(data.resources[1].url).to.be.eql("https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/trackball_ctrl_r62.js");
      done();
    });
  });

  it('should return external preprocessor configuration', (done) => {

    web.getPenProperties('https://codepen.io/woodwork/pen/Xmvppz', (err, data) => {
      expect(err).to.be.null;
      expect(data.html_pre_processor).to.be.eql('pug');
      expect(data.css_pre_processor).to.be.eql('scss');
      done();
    })

  });

});
