// webpack.config.js
module.exports = {
    // Other configuration settings
    devtool: 'source-map',  // Include source maps
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [
            /node_modules\/@tensorflow-models\/coco-ssd/  // Exclude coco-ssd from source map warnings
          ],
        },
      ],
    },
  };
  