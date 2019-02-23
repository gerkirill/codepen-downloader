

const scrape = require('scrape');
const htmlEntities = require('html-entities').AllHtmlEntities;
const http = require('https');
const util = require('./util');

const html = new htmlEntities();

module.exports = {

  _externalResources(json, obj) {
    if (json.resources !== null) obj.resources = json.resources;
  },

  _preProcessors(json, obj) {
    obj.html_pre_processor = json.html_pre_processor;
    obj.css_pre_processor = json.css_pre_processor;
    obj.js_pre_processor = json.js_pre_processor;
  },

  getPenProperties(url, callback) {
    scrape.request(url, (err, $) => {
      const properties = {};
      if (err) return callback(err);
      const penValue = JSON.parse(html.decode($('input#init-data').first().attribs.value));
      const resource = JSON.parse(penValue.__item);

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
};
