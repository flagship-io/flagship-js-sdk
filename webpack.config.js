const nodeConfig = require('./webpack/config.node.js');
const browserConfig = require('./webpack/config.browser.js');
const reactNativeConfig = require('./webpack/config.reactNative.js');
const standAloneConfig = require('./webpack/config.cdn.js');

module.exports = [nodeConfig, browserConfig, reactNativeConfig, standAloneConfig];
