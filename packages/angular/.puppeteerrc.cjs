const { join } = require('node:path');

// Keep the downloaded headless Chrome inside the repository so library
// tests work on machines (and CI runners) without a system Chrome install.
module.exports = {
  cacheDirectory: join(__dirname, '.puppeteer-cache'),
};
