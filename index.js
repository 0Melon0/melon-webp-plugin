const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ConcatSource } = require("webpack-sources");

module.exports = class MelonCosPlugin {
  constructor(options) {
    options.dirName = options.dirName || new Date().toLocaleDateString()
    this.options = options;
    this.cosObj = new COS({
      SecretId: options.SecretId,
      SecretKey: options.SecretKey
    });
  }

  apply(compiler) {

    compiler.hooks.compilation.tap('updateWebp', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('updateHtmlWebp', (data, cb) => {
        data.html = data.html.replace(".png", ".webp");
        cb(null, data)
      })
      compilation.hooks.processAssets.tap({
        name: 'updateCssWebp',
        stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
      }, (assets) => {
        Object.entries(assets).forEach(([pathname, source]) => {
          if (pathname.endsWith(".css")) {
            assets[pathname] = new ConcatSource(source.source().replace(/.png/g, ".webp"));
          }
        });
      });
    });
  }
};