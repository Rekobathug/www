const path = require("path");

module.exports = {
  entry: "./Tchilo/public_html/scripts/app.js",
  output: {
    filename: "app_bundle.js",
    path: __dirname + '/dist'
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
  }
}
