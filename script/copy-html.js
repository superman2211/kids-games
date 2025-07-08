const { copyFileSync, constants } = require('node:fs');

copyFileSync('./src/index.html', './dist/index.html', constants.COPYFILE_EXCL);