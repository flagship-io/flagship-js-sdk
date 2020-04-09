const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');

module.exports = merge(baseConfig, {
  target: 'node', // node.js
  output: {
    filename: 'index.node.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [new DtsBundlePlugin()],
});
function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.hooks.done.tap('dts-bundle', (context, entry) => {
    const dts = require('dts-bundle');
    dts.bundle({
      name: 'flagshipTest',
      main: 'src/**/*.d.ts',
      out: '../dist/flagship.d.ts',
      removeSource: false,
      outputAsModuleFolder: true,
    });
    DtsClean();
  });
};
function DtsClean() {
  var fs = require('fs');
  var data = fs.readFileSync('dist/flagship.d.ts', 'utf-8');
  let newValue = data;
  newValue =
    newValue.slice(
      0,
      newValue.indexOf('import {', newValue.indexOf('import {') + 1)
    ) +
    newValue.slice(
      newValue.indexOf(`} from './class/flagshipVisitor/flagshipVisitor.d';`),
      newValue.length - 1
    );
  newValue = newValue.replace(
    `} from './class/flagshipVisitor/flagshipVisitor.d';`,
    ''
  );
  newValue = newValue.replace(`\n\n\n\n`, '\n');
  newValue = newValue.replace(`\n\n\n`, '\n');
  newValue =
    `import { EventEmitter } from 'events';
    ` +
    `
  declare module flagship {
      ` +
    newValue.split("import { EventEmitter } from 'events';")[1];
  newValue =
    newValue +
    `
  }
  declare const flagship: FlagshipNodeSdk
  export = flagship;
    `;
  fs.writeFileSync('dist/flagship.d.ts', newValue, 'utf-8');
}
