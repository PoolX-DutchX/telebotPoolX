var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }
};