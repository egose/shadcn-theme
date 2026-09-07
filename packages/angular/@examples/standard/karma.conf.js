// Karma configuration for the standard example.
//
// Headless browser contract: `pnpm test:ci` requires a Chrome-compatible
// binary. If CHROME_BIN is not already set, we resolve the repository-local
// browser installed via `pnpm install:browser` (see .puppeteerrc.cjs and the
// README "Headless testing" section).
if (!process.env.CHROME_BIN) {
  const { join } = require('node:path');
  const { readdirSync } = require('node:fs');
  const { computeExecutablePath, detectBrowserPlatform } = require('@puppeteer/browsers');

  // Sync resolution of the repo-local headless browser installed by
  // `pnpm install:browser` (see .puppeteerrc.cjs for the cache location).
  const browser = 'chrome-headless-shell';
  const cacheDir = join(__dirname, '.puppeteer-cache');
  const platform = detectBrowserPlatform();
  const prefix = `${platform}-`;
  const buildIds = readdirSync(join(cacheDir, browser), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => entry.name.slice(prefix.length))
    .sort()
    .reverse();
  if (buildIds.length === 0) {
    throw new Error(
      `No ${browser} binary found in ${cacheDir}. Run \`pnpm install:browser\` first (or set CHROME_BIN).`,
    );
  }
  process.env.CHROME_BIN = computeExecutablePath({ browser, buildId: buildIds[0], cacheDir });
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [require('karma-jasmine'), require('karma-chrome-launcher'), require('karma-jasmine-html-reporter')],
    reporters: ['progress'],
    // Fail when no spec files were loaded instead of silently "passing".
    failOnEmptyTestSuite: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        // 320x844 phone viewport so Tailwind sm/md/lg/xl media queries evaluate
        // against the narrow-viewport contract exercised by
        // shared/responsive-rendering.spec.ts instead of a desktop-wide window.
        flags: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=320,844'],
      },
    },
    restartOnFileChange: false,
    client: {
      clearContext: false,
    },
  });
};
