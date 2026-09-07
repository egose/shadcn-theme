const { join } = require('node:path');

// Keep the downloaded headless Chrome inside the repository so test:ci
// works on machines (and CI runners) without a system Chrome install.
module.exports = {
  cacheDirectory: join(__dirname, '.puppeteer-cache'),
};
