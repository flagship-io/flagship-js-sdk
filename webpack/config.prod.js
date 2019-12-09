const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new DtsBundlePlugin(),
  ],
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
  var newValue = data.replace("import {\n    FlagshipVisitorContext, FsModifsRequestedList, DecisionApiResponse, DecisionApiSimpleResponse, HitShape, GetModificationsOutput,", '');
  newValue = newValue.replace(`} from './class/flagshipVisitor/flagshipVisitor.d';`, '');
  newValue = newValue.replace(`\n\n\n\n`, '\n');
  newValue = newValue.replace(`\n\n\n`, '\n');
  fs.writeFileSync('dist/flagship.d.ts', newValue, 'utf-8');
  console.log('DtsClean complete');
}