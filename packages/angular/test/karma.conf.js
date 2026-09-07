// Shared Karma configuration for library tests.
//
// Headless browser contract: `pnpm test:libraries` (via
// `test/run-library-tests.mjs`) requires a Chrome-compatible binary. If
// CHROME_BIN is not already set, we resolve the repository-local browser
// installed via `pnpm install:browser` (see .puppeteerrc.cjs). A system
// Chrome/Chromium is accepted as a fallback so CI images with a preinstalled
// browser keep working without the download step.
if (!process.env.CHROME_BIN) {
  const { execSync } = require('node:child_process');
  const { existsSync, readdirSync } = require('node:fs');
  const { join } = require('node:path');

  const cacheDir = join(__dirname, '..', '.puppeteer-cache');
  const browser = 'chrome-headless-shell';

  let resolved;
  try {
    const { computeExecutablePath, detectBrowserPlatform } = require('@puppeteer/browsers');
    const platform = detectBrowserPlatform();
    const prefix = `${platform}-`;
    const browserDir = join(cacheDir, browser);
    if (existsSync(browserDir)) {
      const buildIds = readdirSync(browserDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
        .map((entry) => entry.name.slice(prefix.length))
        .sort()
        .reverse();
      if (buildIds.length > 0) {
        const candidate = computeExecutablePath({ browser, buildId: buildIds[0], cacheDir });
        if (existsSync(candidate)) resolved = candidate;
      }
    }
  } catch {
    // @puppeteer/browsers is an optional resolution helper; fall through to
    // system browsers when it cannot be loaded.
  }

  if (!resolved) {
    for (const candidate of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
      try {
        const found = execSync(`command -v ${candidate}`, { encoding: 'utf8' }).trim().split('\n')[0];
        if (found && existsSync(found)) {
          resolved = found;
          break;
        }
      } catch {
        // Try the next candidate.
      }
    }
  }

  if (!resolved) {
    throw new Error(
      `No Chrome binary found. Run \`pnpm install:browser\` first (or set CHROME_BIN). ` +
        `Looked in ${cacheDir} and on PATH (google-chrome, chromium).`,
    );
  }
  process.env.CHROME_BIN = resolved;
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
        flags: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=320,844'],
      },
    },
    restartOnFileChange: false,
    client: {
      clearContext: false,
    },
  });
};
