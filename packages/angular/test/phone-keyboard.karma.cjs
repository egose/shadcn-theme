const base = require('./karma.conf.js');

module.exports = (config) => {
  base(config);
  config.set({
    port: Number(process.env.PHONE_KEYBOARD_PORT ?? 9877),
    browsers: [],
    browserNoActivityTimeout: 120000,
    client: { clearContext: false, args: ['phone-keyboard'] },
  });
};
