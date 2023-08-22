const customConfigPath = process.env.npm_package_config_file;
console.log(customConfigPath); // Output: ./custom.config.js

module.exports = {
  // ...other webpack configuration options...
  mode: 'development', // Set the mode to 'development'
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      timers: require.resolve('timers-browserify'),
      fs: false, // Disable the 'fs' module fallback
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Match .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Match .css files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
