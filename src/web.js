/* eslint no-underscore-dangle: 0 */
/* eslint consistent-return: 0 */
const scrape = require('scrape');
const HtmlEntities = require('html-entities').AllHtmlEntities;
const http = require('https');
const util = require('./util');

const html = new HtmlEntities();

module.exports = {

  _externalResources(json) {
    return (json.resources !== null) ? { resources: json.resources } : {};
  },

  _preProcessors(json) {
    return {
      html_pre_processor: json.html_pre_processor,
      css_pre_processor: json.css_pre_processor,
      js_pre_processor: json.js_pre_processor,
    };
  },

  getPenProperties(url, callback) {
    scrape.request(url, (err, $) => {
      if (err) return callback(err);
      const penValue = JSON.parse(html.decode($('input#init-data').first().attribs.value));
      const resource = JSON.parse(penValue.__item);
      const properties = {
        ...this._externalResources(resource),
        ...this._preProcessors(resource),
      };
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
