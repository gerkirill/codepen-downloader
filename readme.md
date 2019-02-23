# Codepen Downloader

[![NPM Version][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/fredrb/codepen-downloader.svg?branch=master)](https://travis-ci.org/fredrb/codepen-downloader)
[![NPM Downloads][npm-downloads]][npm-url]

Codepen Downloader is a tool used to download showcases from [codepen](http://www.codepen.io) to your machine. This can be done either via a command line tool or from a provided download method.

### Install

It's recommended to install globally since it can be used as command line tool.

`npm install cpen -g`

You can then download any codepen with the following command:

`cpen download <codepen url> [destination]`

You can provide the full URL or only the codepen extension reference (e.g. `/samirc/pen/vGKoxj`)

### Reference:

##### Command line:

`cpen download /samirc/pen/vGKoxj resource`

This will download `.html` `.js` and `.css` files to `resource` folder.

##### cpen.Download(url, destination, onCompleteCallback, [options]):

You can use this method to dynamically download codepen files.

```js
var cpen = require('cpen');

cpen.download('/samirc/pen/vGKoxj', 'resource', function(err) {
  if (err) throw err;
  console.log('Download completed!');
});
```

The options property is used to select which files should be downloaded. Example: `['html', 'css', 'js']`

```js
var cpen = require('cpen');

cpen.download('/ge1doot/pen/aNVYPN', 'resource', function() {
  if (err) throw err;
  console.log('Downloaded JS file to folder');
}, {
  targetFiles : ['js'],
  includeDependencies : true
});

```


#### Contributing

Want to contribute? [Check the recommendations](https://github.com/fredrb/codepen-downloader/blob/master/contributing.md).

[npm-image]: https://img.shields.io/npm/v/cpen.svg
[npm-downloads]: https://img.shields.io/npm/dm/cpen.svg
[npm-url]: https://npmjs.org/package/cpen
