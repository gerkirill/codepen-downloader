#!/usr/bin/env node

const program = require('commander');
const ProgressBar = require('progress');
const cpen = require('../src/cpen');
const packageJson = require('../package.json');

module.exports = program;

function triggerDownload(url, destination = '.', options = {}) {
  const progress = new ProgressBar('Downloading ( :percent )[:bar]', {
    complete: '=',
    incomplete: '-',
    width: 50,
    total: 3,
  });

  // @todo: validate options
  const opts = {
    ...options,
    targetFiles: ['html', 'css', 'js'],
    includeDependencies: true,
    onTick() { progress.tick(); },
  };

  cpen.download(
    url,
    destination,
    err => (err ? console.log(`Error: ${err.message}`) : console.log('Completed')),
    opts,
  );
}

program
  .version(packageJson.version)
  .option('-v, --verbose', 'output more log then usual');

program
  .command('download <url> [destination]')
  .description('Download single codepen.io showcase based on URL')
  .action(triggerDownload);

program.parse(process.argv);
