const nodeConfig = require('./webpack/config.node.js');
const browserConfig = require('./webpack/config.browser.js');
const reactNativeConfig = require('./webpack/config.reactNative.js');
const standaloneConfig = require('./webpack/config.standalone.js');

module.exports = [nodeConfig, browserConfig, reactNativeConfig, standaloneConfig];
