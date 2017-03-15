var webpack = require("webpack");
var path = require("path");

module.exports = {
    target: 'node',
    context: path.resolve(__dirname, './src'),
    entry: path.resolve(__dirname, "./src/index.js"),
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "index.js"
    },
    module: {
      rules: [
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
              loader: 'babel-loader',
              options: { presets: ['es2015'] }
            }],
          }
      ]
    }
};