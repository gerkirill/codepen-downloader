'use strict';

let scrape = require('scrape');
let htmlEntities = require('html-entities').AllHtmlEntities;
let http = require('https');
let util = require('./util');

let html = new htmlEntities();

module.exports = {

  _externalResources(json, obj) {
    if (json.resources !== null)
      obj.resources = json.resources;
  },

  _preProcessors(json, obj) {
    obj.html_pre_processor = json.html_pre_processor;
    obj.css_pre_processor = json.css_pre_processor;
    obj.js_pre_processor = json.js_pre_processor;
  },

  getPenProperties(url, callback) {
    scrape.request(url, (err, $) => {
      let properties = {};
      if (err) return callback(err);
      let penValue = JSON.parse(html.decode($('input#init-data').first().attribs.value));
      let resource = JSON.parse(penValue.__item);

      this._externalResources(resource, properties);
      this._preProcessors(resource, properties);

      callback(null, properties);
    });
  },

  downloadFile(url, file, fn) {
    http.get(`${util.parseUrl(url)}.${file}`, (res) => {
      let buffer = '';
      res
      .on('data', (chunk) => {
        buffer += chunk;
      })
      .on('end', () => {
        fn(null, buffer);
      })
      .on('err', (err) => {
        fn(err);
      });
    });
  },
}
