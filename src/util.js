
/* eslint no-shadow: 0 */
/* eslint consistent-return: 0 */
const fs = require('fs');
const async = require('async');

const fullURL = /http[s]?:\/\/codepen\.io\/(.*)\/(.*)\/(.*)/;
const domainURL = /codepen\.io\/(.*)\/(.*)\/(.*)/;
const penURL = /\/(.*)\/(.*)\/(.*)/;

// todo: take a look into that httpS etc.
const normalURL = /htt[s]?:\/\/(.*)/;

module.exports = {

  evaluateOptions(options) {
    if (options === null || options === undefined) return this.defaultOptions;

    return {
      ...this.defaultOptions,
      ...options,
    };
  },

  parseUrl(url) {
    if (fullURL.exec(url) !== null) {
      return url;
    } if (domainURL.exec(url) !== null) {
      return `http://${url}`;
    } if (penURL.exec(url) !== null) {
      return `http://codepen.io${url}`;
    }
    throw new Error('Invalid URL');
  },

  createDirectoryIfMissing(destination, callback) {
    fs.readdir(destination, (err) => {
      if (!err) return callback();
      fs.mkdir(destination, (err) => {
        callback(err);
      });
    });
  },

  parseScriptUrl(url) {
    if (normalURL.exec(url) === null) return `http:${url}`;
    return url;
  },

  createScriptTag(result) {
    if (!result.details) return '';
    return result.details.resources
      .filter(resource => resource.resource_type === 'js')
      .map(jsResource => `<script src=${jsResource.url}></script>`)
      .join('\n');
  },

  createIndexHtmlFile(file, result, fn) {
    async.parallel([
      callback => fs.readFile(`${__dirname}/template/head01.html`, callback),
      callback => fs.readFile(`${__dirname}/template/head02.html`, callback),
      callback => fs.readFile(`${__dirname}/template/foot.html`, callback),
    ], (err, data) => {
      if (err) return fn(err);
      this.removeFileIfExists(file, (err) => {
        if (err) return fn(err);
        fs.appendFileSync(file, data[0]);
        fs.appendFileSync(file, this.createScriptTag(result));
        fs.appendFileSync(file, data[1]);
        fs.appendFileSync(file, result.html);
        fs.appendFileSync(file, data[2]);
        fn(null, file);
      });
    });
  },

  createFile(file, data, fn) {
    this.removeFileIfExists(file, (err) => {
      if (err) return fn(err);
      fs.appendFile(file, data, fn);
    });
  },

  removeFileIfExists(file, fn) {
    fs.stat(file, (err) => {
      if (!err) {
        fs.unlink(file, fn);
      } else if (err.code !== 'ENOENT') {
        fn(err);
      } else {
        fn(null);
      }
    });
  },

  defaultOptions: {
    targetFiles: ['html', 'css', 'js'],
    includeDependencies: true,
    includePreProcessed: true,
    onTick: null,
  },

};
