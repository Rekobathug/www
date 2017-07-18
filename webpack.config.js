const path = require("path");

module.exports = {
  devtool: "cheap-eval-source-map"
  entry: "./Tchilo/public_html/scripts/app.js",
  output: {
    filename: "app_bundle.js",
    path: __dirname + '/dist',
    publicPath: "/"
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",
        query: {
          presets: ["es2015", "env"]
        },
        test: "/\.js$/",
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: "/"
  }
}
